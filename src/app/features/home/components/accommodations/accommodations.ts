import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodations',
  imports: [CommonModule],
  templateUrl: './accommodations.html',
  styleUrl: './accommodations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccommodationsComponent {
  accommodations = [
    {
      name: 'Geetanjali Guest House',
      rating: 5,
      reviews: 1,
      price: '2,464',
      image: '/accomodation/getanjali.png',
      link: 'https://tourism.tripura.gov.in/hotel?location_id=4'
    },
    {
      name: 'Sagarika Parjatan Niwas',
      rating: 5,
      reviews: 1,
      price: '2,240',
      image: '/accomodation/sagarika.jpeg',
      link:'https://tourism.tripura.gov.in/hotel/sagarika-parjatan-niwas'
    },
    {
      name: 'Eden Tourist Lodge',
      rating: 5,
      reviews: 2,
      price: '1,680',
      image: '/accomodation/eden.jpeg',
      link:'https://tourism.tripura.gov.in/hotel/eden-tourist-lodge'
    }
  ];

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  scrollLeft(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 350;
    el.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' }); // assuming gap-4 (16px)
  }

  scrollRight(el: HTMLElement) {
    const cardWidth = el.firstElementChild?.clientWidth || 350;
    el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
  }
}
