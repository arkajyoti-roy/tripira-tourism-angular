import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-homestays',
  imports: [CommonModule, RouterModule],
  templateUrl: './homestays.html',
  styleUrl: './homestays.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Homestays implements OnInit {
  homestays = signal<any>([]);
  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl
      }/accommodations/homestays`).subscribe({
        next: (data) => {
          this.homestays.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
        },
        error: (err) => {
          console.error("Failed to fetch homestays", err);
        }
      });
  }
}
