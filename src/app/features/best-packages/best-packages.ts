import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-best-packages',
  imports: [CommonModule, RouterModule],
  templateUrl: './best-packages.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BestPackages implements OnInit {
  destinations = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDestinations();
  }

  fetchDestinations() {
    this.http.get<any[]>(`${environment.apiUrl}/tours/destinations`).subscribe({
      next: (data) => {
        const fifoData = data.sort((a, b) => a.id - b.id);
        this.destinations.set(fifoData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch destinations', err);
        this.isLoading.set(false);
      }
    });
  }
}
