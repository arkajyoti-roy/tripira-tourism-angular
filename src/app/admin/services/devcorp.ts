import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevcorpService {
  private apiUrl = `${environment.adminApiUrl}/admin/development-corporation`;

  constructor(private http: HttpClient) { }

  getDevcorps(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDevcorp(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateDevcorp(id: number, data: FormData): Observable<any> {
    data.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteDevcorp(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

