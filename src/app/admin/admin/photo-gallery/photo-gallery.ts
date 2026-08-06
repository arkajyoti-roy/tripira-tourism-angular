import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoGalleryService } from '../../services/photo-gallery';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-photo-gallery',
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css'
})
export class PhotoGallery implements OnInit {
  items: any[] = [];
  searchTerm = '';

  name = '';
  order: number = 0;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  existingImageUrl: string | null = null;

  showForm = false;
  editingItem: any = null;
  
  loading = false;
  message = '';
  error = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private service = inject(PhotoGalleryService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingItem = null;
    this.name = '';
    
    // Calculate max display order + 1
    const maxOrder = this.items.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;

    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
    this.name = '';
    this.order = 0;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getPhotos().subscribe({
      next: (data: any) => {
        this.items = Array.isArray(data) ? data : data.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load photos', err);
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imagePreviewUrl = URL.createObjectURL(this.selectedFile);
      }
    }
  }

  startEdit(item: any) {
    this.editingItem = item;
    this.name = item.name;
    this.order = item.displayorder || 0;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = item.image_url;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.closeForm();
  }

  onSubmit() {
    if (!this.name) {
      this.error = 'Album title is required.';
      return;
    }
    if (!this.editingItem && !this.selectedFile) {
      this.error = 'Please select a cover image.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('displayorder', String(this.order));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.editingItem) {
      this.service.updatePhoto(this.editingItem.id, formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Photo album updated successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to update photo album.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.createPhoto(formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Photo album uploaded successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to upload photo album.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this photo album?').then((confirmed) => {
      if (confirmed) {
        this.service.deletePhoto(id).subscribe({
          next: () => {
            this.message = 'Deleted successfully!';
            this.cdr.detectChanges();
            this.loadItems();
          },
          error: () => {
            this.error = 'Failed to delete photo album.';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
