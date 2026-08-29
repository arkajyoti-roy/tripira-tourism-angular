import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-galleries',
  imports: [CommonModule, RouterModule],
  templateUrl: './video-galleries.html',
  styleUrl: './video-galleries.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGalleries implements OnInit {

  videos = signal<any>([]);
  selectedVideo = signal<any>(null);
  loading = signal<boolean>(true);

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  extractVideoId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|^https?:\/\/(?:www\.)?youtube\.com\/(?:(?:watch)?\?.*v=|(?:embed|v|vi|user)\/))([^#\&\?]*).*/);
    return (match && match[1].length === 11) ? match[1] : null;
  }

  ngOnInit(){
    this.http.get<any[]>(`${environment.apiUrl}/videos`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const processedData = data.map(video => ({
            ...video,
            videoId: this.extractVideoId(video.link)
          }));
          this.videos.set(processedData);
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error(err);
        // Do not set loading to false; keep skeleton visible if no data/error
      }
    });
  }

  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
  }

  openVideoPopup(video: any) {
    this.selectedVideo.set(video);
  }

  closeVideoPopup() {
    this.selectedVideo.set(null);
  }
}
