import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destinations-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './destinations-page.html',
  styleUrl: './destinations-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationsPageComponent implements OnInit {
  destinations = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchDestinations();
  }

  fetchDestinations() {
    this.loading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/tours/destinations`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const fifoData = data.sort((a, b) => a.id - b.id);
          this.destinations.set(fifoData);
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Failed to fetch destinations', err);
        // Do not set loading to false; keep skeleton visible if no data/error
      }
    });
  }
}
