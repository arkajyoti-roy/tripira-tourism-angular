import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = `${environment.adminApiUrl}/admin/logs`;

  constructor(private http: HttpClient) { }

  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

