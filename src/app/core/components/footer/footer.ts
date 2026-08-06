import { Component, signal, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommunicationMediaService, CommunicationMedia } from '../../services/communication-media.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  private mediaService = inject(CommunicationMediaService);
  private cd = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  contact = signal<CommunicationMedia | null>(null);
  activeTab = 'facebook';
  fbIframeUrl!: SafeResourceUrl;

  // Visitor count feature
  visitorCount = signal<number>(0);
  private visitorInterval: any;

  ngOnInit() {
    console.log('Footer ngOnInit: Fetching media from API...');

    // Expose direct Meta Page plugin URL optimized for container width
    this.fbIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fwww.tripuratourism.gov.in%2F&tabs=timeline&width=340&height=360&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=3024557101208885'
    );

    this.mediaService.getMedia().subscribe({
      next: (res: any) => {
        let contactData = null;
        if (res && res.data) {
           contactData = Array.isArray(res.data) ? res.data[0] : res.data;
        } else if (res) {
           contactData = Array.isArray(res) ? res[0] : res;
        }
        if (contactData) {
          this.contact.set(contactData);
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching communication media for footer', err);
      }
    });

    this.initVisitorTracking();
  }

  // Handle switching tabs
  switchTab(tab: 'facebook' | 'instagram') {
    this.activeTab = tab;
    this.cd.detectChanges();
  }

  private initVisitorTracking() {
    // 1. Track the visit (once per session/load)
    this.http.post(`${environment.apiUrl}/visitors/track`, {}).subscribe({
      next: () => {
        this.fetchVisitorCount();
      },
      error: (err) => {
        console.error('Failed to track visitor', err);
        this.fetchVisitorCount();
      }
    });
  }

  private fetchVisitorCount() {
    this.http.get<{ status: string; count: number }>(`${environment.apiUrl}/visitors/count`).subscribe({
      next: (res) => {
        if (res && res.count !== undefined) {
          this.visitorCount.set(res.count);
        }
      },
      error: (err) => {
        console.error('Failed to fetch visitor count', err);
      }
    });
  }
}