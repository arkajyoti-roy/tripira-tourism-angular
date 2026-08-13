import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registered-private-hotels',
  imports: [CommonModule, RouterModule],
  templateUrl: './registered-private-hotels.html',
  styleUrl: './registered-private-hotels.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisteredPrivateHotels implements OnInit {
  hotels = signal<any[]>([]);
  loading = signal<boolean>(true);
  viewMode = signal<'grid' | 'list'>('grid');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/accommodations/private`).subscribe({
      next: (data) => {
        this.hotels.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch private accommodations', err);
        this.loading.set(false);
      }
    });
  }
}
