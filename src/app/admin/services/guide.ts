import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private apiUrl = `${environment.adminApiUrl}/admin/guides`;

  constructor(private http: HttpClient) { }

  getGuides(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createGuide(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateGuide(id: number, data: FormData): Observable<any> {
    data.append('_method', 'PATCH');
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteGuide(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

