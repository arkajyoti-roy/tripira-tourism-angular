import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tsm',
  imports: [CommonModule],
  templateUrl: './tsm.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tsm {
  images = signal<string[]>(['/establishment/tsm.webp']); // Placeholder, user will provide
  currentImageIndex = signal<number>(0);

  nextImage() {
    this.currentImageIndex.update(idx => (idx + 1) % this.images().length);
  }

  prevImage() {
    this.currentImageIndex.update(idx => (idx - 1 + this.images().length) % this.images().length);
  }
}
