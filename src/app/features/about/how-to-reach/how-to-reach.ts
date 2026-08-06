import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-how-to-reach',
  imports: [CommonModule, RouterModule],
  templateUrl: './how-to-reach.html',
  styles: ``
})
export class HowToReach {
  airImages = [
    'about/howtoreach/TripuraAirport.jpg',
    'about/howtoreach/air.jpg',
    'about/howtoreach/reach3.jpg',
    // 'about/howtoreach/reach3.jpg'
  ];
  airCurrentIndex = signal(0);

  nextAirImage() {
    this.airCurrentIndex.update(index => (index + 1) % this.airImages.length);
  }

  prevAirImage() {
    this.airCurrentIndex.update(index => (index - 1 + this.airImages.length) % this.airImages.length);
  }
}
