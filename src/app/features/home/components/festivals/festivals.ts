import { Component, OnInit, signal, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface Slider {
  id: number;
  image: string;
  image_url: string;
  name?: string;
}

@Component({
  selector: 'app-festivals',
  imports: [CommonModule, RouterModule],
  templateUrl: './festivals.html',
  styleUrl: './festivals.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FestivalsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') scrollContainer!: ElementRef;
  festivals = signal<Slider[]>([]);
  autoScrollInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchFestivals();
  }

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.pauseAutoScroll();
  }

  fetchFestivals() {
    this.http.get<Slider[]>(`${environment.apiUrl}/tours/featured`).subscribe({
      next: (data) => {
        this.festivals.set(data.sort((a:any, b:any)=> a.displayorder - b.displayorder));
      },
      error: (err) => {
        console.error('Failed to fetch festivals', err);
      }
    });
  }

  startAutoScroll() {
    if (this.autoScrollInterval) return;
    this.autoScrollInterval = setInterval(() => {
      if (this.scrollContainer && this.scrollContainer.nativeElement) {
        const el = this.scrollContainer.nativeElement;
        const cardWidth = el.firstElementChild?.clientWidth || 400;
        
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
        }
      }
    }, 3000); // 3 seconds interval
  }

  pauseAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  resumeAutoScroll() {
    this.startAutoScroll();
  }

  scrollLeft(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 400;
    el.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' }); // 16px is the gap-4
  }

  scrollRight(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 400;
    el.scrollBy({ left: (cardWidth + 16), behavior: 'smooth' });
  }
}
