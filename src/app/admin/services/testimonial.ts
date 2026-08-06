import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private apiUrl = `${environment.adminApiUrl}/admin/testimonials`;
  private http = inject(HttpClient);

  getTestimonials(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTestimonial(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTestimonial(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateTestimonial(id: number, formData: FormData): Observable<any> {
    // Laravel handles file uploads via POST, so we can send with a spoofed method or just use a standard POST endpoint
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  deleteTestimonial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

