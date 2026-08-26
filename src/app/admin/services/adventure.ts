import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {
  private apiUrl = `${environment.adminApiUrl}/admin/adventures`;

  constructor(private http: HttpClient) { }

  getAdventures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAdventure(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAdventure(id: number, data: FormData): Observable<any> {
    // Laravel doesn't support PUT with multipart/form-data, so we use POST + _method
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }

  deleteAdventure(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


