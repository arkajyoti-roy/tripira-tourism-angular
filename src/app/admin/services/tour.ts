import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = `${environment.adminApiUrl}/admin/tours`;

  constructor(private http: HttpClient) { }

  getTours(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTour(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateTour(id: number, data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteTour(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

