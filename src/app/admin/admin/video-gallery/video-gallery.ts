import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoGalleryService } from '../../services/video-gallery';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-video-gallery',
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './video-gallery.html',
  styleUrl: './video-gallery.css'
})
export class VideoGallery implements OnInit {
  items: any[] = [];
  searchTerm = '';

  name = '';
  link = '';

  showForm = false;
  editingItem: any = null;
  
  loading = false;
  message = '';
  error = '';

  private service = inject(VideoGalleryService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingItem = null;
    this.name = '';
    this.link = '';
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
    this.name = '';
    this.link = '';
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getVideos().subscribe({
      next: (data: any) => {
        this.items = Array.isArray(data) ? data : data.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load videos', err);
        this.cdr.detectChanges();
      }
    });
  }

  selectedVideo: any = null;

  getYouTubeId(url: string): string {
    if (!url) return '';
    // If it's already just an ID (11 characters without slashes or dots)
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
      return url;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  getSafeUrl(link: string) {
    const videoId = this.getYouTubeId(link);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  openVideoPopup(item: any) {
    this.selectedVideo = item;
    this.cdr.detectChanges();
  }

  closeVideoPopup() {
    this.selectedVideo = null;
    this.cdr.detectChanges();
  }

  startEdit(item: any) {
    this.editingItem = item;
    this.name = item.name;
    this.link = item.link;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.closeForm();
  }

  onSubmit() {
    if (!this.name || !this.link) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';

    const payload = { name: this.name, link: this.link };

    if (this.editingItem) {
      this.service.updateVideo(this.editingItem.id, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Video updated successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to update video.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.createVideo(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Video embed added successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to add video embed.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this video?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteVideo(id).subscribe({
          next: () => {
            this.message = 'Deleted successfully!';
            this.cdr.detectChanges();
            this.loadItems();
          },
          error: () => {
            this.error = 'Failed to delete video.';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
