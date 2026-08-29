import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface TenderDoc {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-tender',
  imports: [CommonModule, RouterModule],
  templateUrl: './tender.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tender implements OnInit {
  documents = signal<TenderDoc[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch tenders from backend API using doctype=2
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=2`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        if (data && data.length > 0) {
          this.documents.set(data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching tenders:', err);
        // this.error.set('Failed to load tenders.');
        // Do not set isLoading to false; keep skeleton visible if no data/error
      }
    });
  }
  
  getPDFUrl(doc: TenderDoc): string {
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
