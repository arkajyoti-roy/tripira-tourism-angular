import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-leaseout-ttdcl',
  imports: [CommonModule, RouterModule],
  templateUrl: './leaseout-ttdcl.html',
  styleUrl: './leaseout-ttdcl.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaseoutTtdcl implements OnInit {
  accommodations = signal<any[]>([]);
constructor(private http: HttpClient) {}
ngOnInit(){
  this.http.get<any[]>(`${environment.apiUrl}/accommodations/leaseout`).subscribe({
    next: (data) =>{
      this.accommodations.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
    },
    error: (err) => {
      console.error('Failed to fetch Leas', err);
    }
  });
}
}
