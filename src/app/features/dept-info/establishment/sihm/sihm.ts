import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sihm',
  imports: [CommonModule],
  templateUrl: './sihm.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sihm {
  images = signal<string[]>(['/establishment/sihm.jpg']); // Placeholder, user will provide
  currentImageIndex = signal<number>(0);

  nextImage() {
    this.currentImageIndex.update(idx => (idx + 1) % this.images().length);
  }

  prevImage() {
    this.currentImageIndex.update(idx => (idx - 1 + this.images().length) % this.images().length);
  }
}
