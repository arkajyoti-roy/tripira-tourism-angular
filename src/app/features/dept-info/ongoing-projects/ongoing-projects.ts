import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ProjectDoc {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-ongoing-projects',
  imports: [CommonModule, RouterModule],
  templateUrl: './ongoing-projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingProjects implements OnInit {
  documents = signal<ProjectDoc[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch documents from backend API using doctype=4
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=4`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        if (data && data.length > 0) {
          this.documents.set(data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching ongoing projects:', err);
        // this.error.set('Failed to load ongoing projects.');
        // Do not set isLoading to false; keep skeleton visible if no data/error
      }
    });
  }
  
  getPDFUrl(doc: ProjectDoc): string {
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
