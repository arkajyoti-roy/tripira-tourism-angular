import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Guideline {
  id?: number;
  docid?: number;
  des: string;
  file: string;
  file_url?: string;
}

@Component({
  selector: 'app-guidelines',
  imports: [CommonModule, RouterModule],
  templateUrl: './guidelines.html',
  styleUrl: './guidelines.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Guidelines implements OnInit {
  guidelines = signal<Guideline[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/documents?doctype=5`).subscribe({
      next: (response) => {
        // Handle if response is array or object with data property
        const data = Array.isArray(response) ? response : (response.data || []);
        if (data && data.length > 0) {
          this.guidelines.set(data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching guidelines:', err);
        // this.error.set('Failed to load guidelines.');
        // Do not set isLoading to false; keep skeleton visible if no data/error
      }
    });
  }
  
  getPDFUrl(g: Guideline): string {
    if (g.file_url) return g.file_url;
    if (g.file) {
      if (g.file.startsWith('http')) return g.file;
      const storageBase = environment.apiUrl.replace('/api/public', '/storage');
      return `${storageBase}/documents/${g.file}`;
    }
    return '#';
  }
}
