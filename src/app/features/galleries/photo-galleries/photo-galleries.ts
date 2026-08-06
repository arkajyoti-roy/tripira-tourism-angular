import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment'
@Component({
  selector: 'app-photo-galleries',
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-galleries.html',
  styleUrl: './photo-galleries.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleries implements OnInit {
  photos = signal<any>([]);
  constructor(private http: HttpClient){}
 
    ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl
      }/photos`).subscribe({
        next: (data) => {
          this.photos.set(data.sort((a:any, b:any)=>a.displayorder - b.displayorder));
        },
        error: (err) => {
          console.error("Failed to fetch photos", err);
        }
      });
  }
  }


