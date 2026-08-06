import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Person {
  id: number;
  name: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  facebook: string;
  Twitter: string;
  displayorder: number;
  image_url: string;
}

@Component({
  selector: 'app-who-is-who',
  imports: [CommonModule, RouterModule],
  templateUrl: './who-is-who.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhoIsWho implements OnInit {
  directorate = signal<Person[]>([]);
  ttdcl = signal<Person[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch both Directorate and TTDCL concurrently
    const directorateUrl = `${environment.apiUrl}/directorate`;
    const ttdclUrl = `${environment.apiUrl}/development-corporation`;

    let directorateDone = false;
    let ttdclDone = false;
    let hasError = false;

    const checkDone = () => {
      if (directorateDone && ttdclDone) {
        this.isLoading.set(false);
      }
    };

    this.http.get<any>(directorateUrl).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        // Sort by display order
        this.directorate.set(data.sort((a: Person, b: Person) => a.displayorder - b.displayorder));
        directorateDone = true;
        checkDone();
      },
      error: (err) => {
        console.error('Error fetching directorate:', err);
        if (!hasError) {
          hasError = true;
          this.error.set('Failed to load Who is Who details.');
          this.isLoading.set(false);
        }
      }
    });

    this.http.get<any>(ttdclUrl).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        // Sort by display order
        this.ttdcl.set(data.sort((a: Person, b: Person) => a.displayorder - b.displayorder));
        ttdclDone = true;
        checkDone();
      },
      error: (err) => {
        console.error('Error fetching ttdcl:', err);
        if (!hasError) {
          hasError = true;
          this.error.set('Failed to load Who is Who details.');
          this.isLoading.set(false);
        }
      }
    });
  }
}
