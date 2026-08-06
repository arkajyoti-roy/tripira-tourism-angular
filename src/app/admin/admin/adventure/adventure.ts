import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdventureService } from '../../services/adventure';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './adventure.html',
  styleUrls: ['./adventure.css']
})
export class Adventure implements OnInit {
  items: any[] = [];
  searchTerm = '';
  adventure_type = '';
  name = '';
  description = '';
  location = '';
  price = '';
  contact_phone = '';
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  existingImageUrl: string | null = null;
  loading = false;
  message = '';
  error = '';
  showForm = false;
  editingId: number | null = null;
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private service = inject(AdventureService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingId = null;
    this.adventure_type = '';
    this.name = '';
    this.description = '';
    this.location = '';
    this.price = '';
    this.contact_phone = '';
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
    this.editingId = null;
    this.adventure_type = '';
    this.name = '';
    this.description = '';
    this.location = '';
    this.price = '';
    this.contact_phone = '';
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getAdventures().subscribe({
      next: (data: any) => {
        this.items = Array.isArray(data) ? data : data.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load items', err);
        this.cdr.detectChanges();
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imagePreviewUrl = URL.createObjectURL(this.selectedFile);
      }
    }
  }

  editItem(item: any) {
    this.editingId = item.id;
    this.adventure_type = item.adventure_type || '';
    this.name = item.name || '';
    this.description = item.description || '';
    this.location = item.location || '';
    this.price = item.price || '';
    this.contact_phone = item.contact_phone || '';
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = item.image_url;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  resetForm() {
    this.closeForm();
  }

  onSubmit() {
    if (!this.name || !this.description) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('adventure_type', this.adventure_type);
    formData.append('name', this.name);
    formData.append('description', this.description);

    if (this.location) formData.append('location', this.location);
    if (this.price) formData.append('price', this.price);
    if (this.contact_phone) formData.append('contact_phone', this.contact_phone);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    if (this.editingId) {
      this.service.updateAdventure(this.editingId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Adventure updated successfully!';
          this.resetForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.createAdventure(formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Adventure created successfully!';
          this.resetForm();
          this.cdr.detectChanges();
          this.loadItems();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this adventure?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteAdventure(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
