import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, signal, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-destinations',
  imports: [CommonModule, RouterModule],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  autoScrollInterval: any;

  destinations = signal<any[]>([]);

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {
    this.fetchDestinations();
  }
 
  fetchDestinations() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (data) => {
      this.destinations.set(data.sort((a: any, b: any) => a.displayorder - b.displayorder));
      },
      error: (err) => {
        console.error('Failed to fetch destinations', err);
      }
    });
  }

  ngAfterViewInit() {
    this.startAutoScroll();
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      this.ngZone.runOutsideAngular(() => {
        this.scrollContainer.nativeElement.addEventListener('scroll', this.onScrollBind);
      });
    }
  }

  onScrollBind = this.onScroll.bind(this);

  ngOnDestroy() {
    this.stopAutoScroll();
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      this.scrollContainer.nativeElement.removeEventListener('scroll', this.onScrollBind);
    }
  }

  startAutoScroll() {
    this.ngZone.runOutsideAngular(() => {
      this.autoScrollInterval = setInterval(() => {
        if (this.scrollContainer && this.scrollContainer.nativeElement) {
          const el = this.scrollContainer.nativeElement;
          const maxScroll = el.scrollWidth - el.clientWidth;
          const cardWidth = el.firstElementChild?.clientWidth || 280;
          const scrollAmount = cardWidth + 20; // card width + gap
          
          if (el.scrollLeft >= maxScroll - 5) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000);
    });
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  pauseAutoScroll() {
    this.stopAutoScroll();
  }

  resumeAutoScroll() {
    this.startAutoScroll();
  }

  activeIndex = signal(0);

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const cardWidth = el.firstElementChild?.clientWidth || 280;
    const scrollAmount = cardWidth + 20;
    const index = Math.round(el.scrollLeft / scrollAmount);
    if (this.activeIndex() !== index) {
      this.ngZone.run(() => {
        this.activeIndex.set(index);
      });
    }
  }

  scrollToIndex(el: HTMLElement, index: number) {
    const cardWidth = el.firstElementChild?.clientWidth || 280;
    const scrollAmount = cardWidth + 20;
    el.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
    this.ngZone.run(() => {
      this.activeIndex.set(index);
    });
    // Restart auto-scroll timer to prevent fighting with manual click
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  scrollLeft(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 280;
    el.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
  }

  scrollRight(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 280;
    el.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
  }

  wishlist: number[] = [];

  toggleWishlist(index: number, event: Event) {
    if (this.wishlist.includes(index)) {
      this.wishlist = this.wishlist.filter(i => i !== index);
    } else {
      this.wishlist.push(index);
    }
  }
}
