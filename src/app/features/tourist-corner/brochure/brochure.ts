import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface BrochureDoc {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-brochure',
  imports: [CommonModule, RouterModule],
  templateUrl: './brochure.html',
  styleUrl: './brochure.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Brochure implements OnInit {
  documents = signal<BrochureDoc[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch brochures from backend API
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=8`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.documents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching brochures:', err);
        // Fallback to a different endpoint name if the first one fails
        this.http.get<any>(`${environment.apiUrl}/brochures`).subscribe({
          next: (response) => {
            const data = Array.isArray(response) ? response : (response.data || []);
            this.documents.set(data);
            this.isLoading.set(false);
          },
          error: (err2) => {
            console.error('Error fetching brochures (fallback):', err2);
            this.error.set('Failed to load brochures.');
            this.isLoading.set(false);
          }
        });
      }
    });
  }
  
  getPDFUrl(doc: BrochureDoc): string {
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
