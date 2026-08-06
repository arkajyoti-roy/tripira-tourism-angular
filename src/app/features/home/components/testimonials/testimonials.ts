import { Component, signal, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  image: string | null;
  testimonial: string;
  rating: number;
  image_url: string | null;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials = signal<{ name: string; rating: number; text: string; image: string; designation: string }[]>([]);

  currentIndex = signal(0);
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.http.get<any>(`${environment.apiUrl}/testimonials`).subscribe({
      next: (res) => {
        const dataArray = Array.isArray(res) ? res : (res?.data || []);
        const mapped = dataArray.map((t: any) => ({
          name: t.name,
          rating: t.rating,
          text: t.testimonial,
          image: t.image_url || t.image || '',
          designation: t.designation || 'Verified Traveller',
          displayorder: t.displayorder || 0
        }));
        this.testimonials.set(mapped.sort((a:any, b:any)=> a.displayorder - b.displayorder));
        if (mapped.length > 1) {
          this.startSlider();
        }
      },
      error: (err) => {
        console.error('Failed to fetch testimonials', err);
      }
    });
  }

  ngOnDestroy() {
    this.stopSlider();
  }

  startSlider() {
    this.stopSlider();
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopSlider() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex.update(i => (i + 1) % this.testimonials().length);
  }

  setIndex(index: number) {
    this.currentIndex.set(index);
    this.stopSlider();
    this.startSlider();
  }

  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  getSlideState(index: number): 'active' | 'left' | 'right' | 'hidden' {
    const current = this.currentIndex();
    const len = this.testimonials().length;
    
    if (index === current) return 'active';
    if (index === (current - 1 + len) % len) return 'left';
    if (index === (current + 1) % len) return 'right';
    return 'hidden';
  }
}

