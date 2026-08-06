import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  data: HttpResponse<any>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 15000; // 15 seconds

export const cacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const url = req.urlWithParams;
  const cached = cache.get(url);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION_MS) {
    // Return cached response instantly
    return of(cached.data.clone());
  }

  // Cache expired or missing
  if (cached) {
    cache.delete(url);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(url, {
          data: event.clone(),
          timestamp: Date.now()
        });
      }
    })
  );
};
