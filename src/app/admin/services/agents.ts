import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  private apiUrl = `${environment.adminApiUrl}/admin/agents`;

  constructor(private http: HttpClient) { }

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAgent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAgent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

