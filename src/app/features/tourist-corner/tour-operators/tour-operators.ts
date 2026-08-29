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
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validData = data.filter((item: any) => {
          if (!item.validDate) return true;
          
          let dateStr = item.validDate.toString().trim();
          const parts = dateStr.split(/[-/]/);
          let parsedDate = new Date(dateStr);
          
          // Handle DD-MM-YYYY or DD/MM/YYYY
          if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
          
          // If we can't parse it (e.g., "Lifetime" or similar text), assume it's valid
          if (isNaN(parsedDate.getTime())) return true; 
          
          return parsedDate >= today;
        });

        if (validData && validData.length > 0) {
          this.operators.set(validData.sort((a:any, b:any)=> a.displayorder - b.displayorder));
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching tour operators:', err);
        // this.error.set('Failed to load tour operators.');
        // Do not set isLoading to false; keep skeleton visible if no data/error
      }
    });
  }
}
