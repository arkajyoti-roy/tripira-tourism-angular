import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Guide {
  id?: number;
  slNo?: number;
  photo?: string;
  image?: string;
  image_url?: string;
  name: string;
  address: string;
  phone: string;
  language: string;
  spot: string;
  validDate: string;
}

@Component({
  selector: 'app-tourist-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './tourist-guide.html',
  styleUrl: './tourist-guide.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TouristGuide implements OnInit {
  guides = signal<Guide[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch tourist guides from backend API. 
    this.http.get<any>(`${environment.apiUrl}/guides`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.guides.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tourist guides:', err);
        this.error.set('Failed to load tourist guides.');
        this.isLoading.set(false);
      }
    });
  }
  
  getPhotoUrl(guide: Guide): string {
    if (guide.image_url) {
      return guide.image_url;
    }
    const filename = guide.image || guide.photo;
    if (!filename || filename === 'default-avatar.png') {
      return '/images/avatar.jpg'; 
    }
    if (filename.startsWith('http')) {
      return filename;
    }
    const storageBase = environment.apiUrl.replace('/api/public', '/storage');
    return `${storageBase}/guides/${filename}`;
  }
}
