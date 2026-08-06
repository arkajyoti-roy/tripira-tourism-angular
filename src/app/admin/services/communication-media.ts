import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicationMediaService {
  private apiUrl = `${environment.adminApiUrl}/admin/communication-media`;
  private http = inject(HttpClient);

  getSettings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateSettings(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

