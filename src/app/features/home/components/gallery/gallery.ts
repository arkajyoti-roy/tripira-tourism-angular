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
    { src: '/gallery/air1.jpg', isVideo: false },
    { src: '/gallery/Comp1.mp4', isVideo: true },
    { src: '/gallery/reach2.jpg', isVideo: false },
    { src: '/gallery/Comp2.mp4', isVideo: true },
    { src: '/gallery/air2.jpg', isVideo: false },
    { src: '/gallery/Comp3.mp4', isVideo: true },
    { src: '/gallery/photo-gallary-5.png', isVideo: false },
    { src: '/gallery/Comp4.mp4', isVideo: true },
    { src: '/gallery/reach3.jpg', isVideo: false },
    { src: '/gallery/Comp5.mp4', isVideo: true },
    { src: '/gallery/TripuraAirport.jpg', isVideo: false },
    { src: '/gallery/Comp6.mp4', isVideo: true }
  ];
}
