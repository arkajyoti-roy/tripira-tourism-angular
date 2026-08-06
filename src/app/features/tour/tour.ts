import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour',
  imports: [CommonModule, RouterModule],
  templateUrl: './tour.html',
  styleUrl: './tour.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tour implements OnInit {
  tour = signal<any>(null);
  currentImageIndex = signal(0);
  images = signal<string[]>([]);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const type = this.route.snapshot.queryParamMap.get('type') || 'destinations';
      if (id) {
        this.fetchTourDetails(id, type);
      }
    });
  }

  fetchTourDetails(id: string, type: string) {
    let endpoint = 'tours/destinations';
    if (type === 'featured') {
      endpoint = 'tours/featured';
    } else if (type === 'festivals') {
      endpoint = 'tours/festivals';
    } else if (type === 'categories') {
      endpoint = 'categories';
    } else if (type === 'govt_accommodations') {
      endpoint = 'accommodations/govt';
    } else if (type.startsWith('accommodations/') || type.startsWith('tours/')) {
      endpoint = type;
    }

    this.http.get<any[]>(`${environment.apiUrl}/${endpoint}`).subscribe({
      next: (data) => {
        const found = data.find(item => {
          if (type === 'govt_accommodations' || type.startsWith('accommodations/')) {
            return item.aid?.toString() === id;
          }
          return item.id?.toString() === id;
        });
        
        if (found) {
          this.setupTour(found);
        } else {
          console.warn(`Tour with id ${id} not found in ${endpoint}.`);
        }
      },
      error: (err) => console.error(`Failed to fetch from ${endpoint}`, err)
    });
  }

  setupTour(found: any) {
    // Map accommodation fields to standard tour fields if necessary
    if (found.address && !found.location) found.location = found.address;
    if (found.contact && !found.phone) found.phone = found.contact;
    
    this.tour.set(found);
    const imgs = [];
    if (found.image_url) imgs.push(found.image_url);
    if (found.image2_url) imgs.push(found.image2_url);
    if (found.image3_url) imgs.push(found.image3_url);
    
    // Fallback if APIs don't have *_url but have image, image2, etc.
    if (imgs.length === 0 && found.image) {
      const storageBase = environment.apiUrl.replace('/api/public', '/storage');
      imgs.push(`${storageBase}/${found.image}`);
      if (found.image2) imgs.push(`${storageBase}/${found.image2}`);
      if (found.image3) imgs.push(`${storageBase}/${found.image3}`);
    }
    
    this.images.set(imgs);
    this.currentImageIndex.set(0);
  }

  nextImage() {
    if (this.images().length > 1) {
      this.currentImageIndex.set((this.currentImageIndex() + 1) % this.images().length);
    }
  }

  prevImage() {
    if (this.images().length > 1) {
      this.currentImageIndex.set((this.currentImageIndex() - 1 + this.images().length) % this.images().length);
    }
  }

  getMapLink(): string {
    const mapData = this.tour()?.map;
    if (!mapData) return '';
    if (mapData.startsWith('http://') || mapData.startsWith('https://')) {
      return mapData;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapData)}`;
  }

  getLocationLink(): string {
    const locData = this.tour()?.location;
    if (!locData) return '';
    if (locData.startsWith('http://') || locData.startsWith('https://')) {
      return locData;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locData)}`;
  }
}
