import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-under-ttdcl',
  imports: [CommonModule, RouterModule],
  templateUrl: './under-ttdcl.html',
  styleUrl: './under-ttdcl.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnderTtdcl implements OnInit {
  lodges = signal<any>([]);
  constructor(private http: HttpClient){}
  ngOnInit(){
    this.http.get<any[]>(`${environment.apiUrl}/accommodations/govt`).subscribe({
      next: (data) => {
        this.lodges.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
      },
      error: (err) => {
        console.error("Failed to fetch lodges");
      }
    });
  }
}
