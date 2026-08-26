import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoGalleryService {
  private apiUrl = `${environment.adminApiUrl}/admin/photos`;

  constructor(private http: HttpClient) { }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPhoto(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updatePhoto(id: number, formData: FormData): Observable<any> {
    // Laravel requires POST + _method=PUT for multipart form updates
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

