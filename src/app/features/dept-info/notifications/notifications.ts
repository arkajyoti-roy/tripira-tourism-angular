import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface NotificationDoc {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notifications implements OnInit {
  documents = signal<NotificationDoc[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch notifications from backend API using doctype=1
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=1`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.documents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.error.set('Failed to load notifications.');
        this.isLoading.set(false);
      }
    });
  }
  
  getPDFUrl(doc: NotificationDoc): string {
    if (doc.file_url) {
      return doc.file_url;
    }
    if (doc.file && doc.file.startsWith('http')) {
      return doc.file;
    }
    const storageBase = environment.apiUrl.replace('/api/public', '/storage');
    return `${storageBase}/documents/${doc.file}`;
  }
}
