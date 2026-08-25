import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private apiUrl = `${environment.adminApiUrl}/admin/accommodations`;

  constructor(private http: HttpClient) { }

  getAccommodations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAccommodation(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAccommodation(id: number, data: FormData): Observable<any> {
    data.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteAccommodation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

