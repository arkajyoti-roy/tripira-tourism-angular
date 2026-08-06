import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoGalleryService {
  private apiUrl = `${environment.adminApiUrl}/admin/videos`;

  constructor(private http: HttpClient) { }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createVideo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateVideo(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

