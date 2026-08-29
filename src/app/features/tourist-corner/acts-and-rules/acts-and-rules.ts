import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ActRule {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-acts-and-rules',
  imports: [CommonModule, RouterModule],
  templateUrl: './acts-and-rules.html',
  styleUrl: './acts-and-rules.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActsAndRules implements OnInit {
  documents = signal<ActRule[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch acts and rules from backend API using doctype=10 as specified
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=9`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        if (data && data.length > 0) {
          this.documents.set(data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching acts and rules:', err);
        // Fallback to try a different endpoint name if the first one fails
        this.http.get<any>(`${environment.apiUrl}/acts-and-rules`).subscribe({
          next: (response) => {
            const data = Array.isArray(response) ? response : (response.data || []);
            if (data && data.length > 0) {
              this.documents.set(data);
              this.isLoading.set(false);
            }
          },
          error: (err2) => {
            console.error('Error fetching acts and rules (fallback):', err2);
            // this.error.set('Failed to load acts and rules.');
            // Do not set isLoading to false; keep skeleton visible if no data/error
          }
        });
      }
    });
  }
  
  getPDFUrl(doc: ActRule): string {
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
