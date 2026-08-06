import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CommunicationMedia {
  id: number;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationMediaService {
  private http = inject(HttpClient);
  
  getMedia(): Observable<CommunicationMedia> {
    return this.http.get<CommunicationMedia>(`${environment.apiUrl}/communication-media`);
  }
}
