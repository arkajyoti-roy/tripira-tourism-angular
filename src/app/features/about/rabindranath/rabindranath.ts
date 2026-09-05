import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rabindranath',
  imports: [CommonModule, RouterModule],
  templateUrl: './rabindranath.html',
  styles: ``,
})
export class Rabindranath {
  images = [
    '/about/rabindranath/0.webp',
    '/about/rabindranath/1.webp',
    '/about/rabindranath/2.webp',
    '/about/rabindranath/3.webp',
    '/about/rabindranath/4.webp',
    '/about/rabindranath/5.webp'
  ];
  
  currentIndex = 0;

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
