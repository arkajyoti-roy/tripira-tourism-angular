import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.adminApiUrl}/admin/settings`;
  private http = inject(HttpClient);

  sendVerificationOtp(): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, {});
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  changeEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-email`, data);
  }

  getAccessEmails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/access-emails`);
  }

  addAccessEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/access-emails`, { email });
  }

  deleteAccessEmail(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/access-emails/${id}`);
  }
}

