import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.adminApiUrl}/admin`;

  constructor(private http: HttpClient) { }

  login(credentials: {email: string, password?: string, otp?: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('admin_token', response.token);
          localStorage.setItem('admin_user', JSON.stringify(response.user));
        }
      })
    );
  }

  sendLoginOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-login-otp`, { email });
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.adminApiUrl}/admin/logout`, {}).pipe(
      tap({
        next: () => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        },
        error: () => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  getOperatorEmail(): string | null {
    try {
      const userStr = localStorage.getItem('admin_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.email || null;
      }
    } catch (e) {}
    return null;
  }

  changeCredentials(payload: { email: string, current_password: string, new_password?: string, otp: string }): Observable<any> {
    return this.http.post(`${environment.adminApiUrl}/admin/change-credentials`, payload).pipe(
      tap((response: any) => {
        if (response && response.user) {
          localStorage.setItem('admin_user', JSON.stringify(response.user));
        }
      })
    );
  }

  sendOtp(): Observable<any> {
    return this.http.post(`${environment.adminApiUrl}/admin/send-otp`, {});
  }
}

