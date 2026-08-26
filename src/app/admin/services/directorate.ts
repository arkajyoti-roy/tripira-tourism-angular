import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DirectorateService {
  private apiUrl = `${environment.adminApiUrl}/admin/directorate`;

  constructor(private http: HttpClient) { }

  getDirectorates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDirectorate(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateDirectorate(id: number, data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteDirectorate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

