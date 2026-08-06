import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {
  private apiUrl = `${environment.adminApiUrl}/admin/smtp-settings`;

  constructor(private http: HttpClient) { }

  getSettings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateSettings(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}

