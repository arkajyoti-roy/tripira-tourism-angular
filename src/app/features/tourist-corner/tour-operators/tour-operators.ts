import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface TourOperator {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  validDate: string;
}

@Component({
  selector: 'app-tour-operators',
  imports: [CommonModule, RouterModule],
  templateUrl: './tour-operators.html',
  styleUrl: './tour-operators.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourOperators implements OnInit {
  operators = signal<TourOperator[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch tour operators from backend API
    this.http.get<any>(`${environment.apiUrl}/agents`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.operators.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tour operators:', err);
        this.error.set('Failed to load tour operators.');
        this.isLoading.set(false);
      }
    });
  }
}
