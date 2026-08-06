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
    '/about/rabindranath/0.jpg',
    '/about/rabindranath/1.jpg',
    '/about/rabindranath/2.jpg',
    '/about/rabindranath/3.jpg',
    '/about/rabindranath/4.jpg',
    '/about/rabindranath/5.jpg'
  ];
  
  currentIndex = 0;

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
