import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.adminApiUrl}/admin/documents`;

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createDocument(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateDocument(id: number, data: FormData): Observable<any> {
    // We append _method=PUT to the FormData and send it as POST
    data.append('_method', 'PATCH');
    return this.http.post<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

