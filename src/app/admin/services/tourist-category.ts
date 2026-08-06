import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TouristCategoryService {
  private apiUrl = `${environment.adminApiUrl}/admin/tourist-category`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCategory(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    // Note: sending POST with _method=PUT isn't strictly necessary here since our new route is purely POST for update.
    // However, if the server expects PUT logic, Laravel accepts POST with _method appended.
    // Given we defined it as POST in api.php, we just post to the ID endpoint.
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

