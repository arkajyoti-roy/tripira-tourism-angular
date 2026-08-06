import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Festival {
  id: number;
  name: string;
  description: string;
  image: string;
  image_url: string;
}

@Component({
  selector: 'app-festivals',
  imports: [CommonModule, RouterModule],
  templateUrl: './festivals.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Festivals implements OnInit {
  festivals = signal<Festival[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/tours/festivals`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.festivals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching festivals:', err);
        this.error.set('Failed to load festivals.');
        this.isLoading.set(false);
      }
    });
  }

  getImageUrl(festival: Festival): string {
    if (festival.image_url) {
      return festival.image_url;
    }
    if (festival.image && festival.image.startsWith('http')) {
      return festival.image;
    }
    const storageBase = environment.apiUrl.replace('/api/public', '/storage');
    return `${storageBase}/tour/${festival.image}`;
  }
}
