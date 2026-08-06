import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('admin_token');
  const userStr = localStorage.getItem('admin_user');
  let operatorEmail = '';
  if (userStr) {
    try {
      operatorEmail = JSON.parse(userStr).email || '';
    } catch(e) {}
  }

  if (token) {
    const headers: any = {
      Authorization: `Bearer ${token}`
    };
    if (operatorEmail) {
      headers['X-Operator-Email'] = operatorEmail;
    }
    req = req.clone({
      setHeaders: headers
    });
  }
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
