import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  images = [
    { src: '/gallery/air1.webp', isVideo: false },
    { src: '/gallery/Comp1.mp4', isVideo: true },
    { src: '/gallery/reach2.webp', isVideo: false },
    { src: '/gallery/Comp2.mp4', isVideo: true },
    { src: '/gallery/air2.webp', isVideo: false },
    { src: '/gallery/Comp3.mp4', isVideo: true },
    { src: '/gallery/photo-gallary-5.webp', isVideo: false },
    { src: '/gallery/Comp4.mp4', isVideo: true },
    { src: '/gallery/reach3.webp', isVideo: false },
    { src: '/gallery/Comp5.mp4', isVideo: true },
    { src: '/gallery/TripuraAirport.webp', isVideo: false },
    { src: '/gallery/Comp6.mp4', isVideo: true }
  ];
}
