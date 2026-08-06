import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface RecruitmentDoc {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-recruitment',
  imports: [CommonModule, RouterModule],
  templateUrl: './recruitment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recruitment implements OnInit {
  documents = signal<RecruitmentDoc[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch documents from backend API using doctype=10
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=10`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.documents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching recruitment documents:', err);
        this.error.set('Failed to load recruitment documents.');
        this.isLoading.set(false);
      }
    });
  }
  
  getPDFUrl(doc: RecruitmentDoc): string {
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
