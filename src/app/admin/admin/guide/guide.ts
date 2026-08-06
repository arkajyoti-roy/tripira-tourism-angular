import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '../../services/guide';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './guide.html',
  styleUrls: ['./guide.css']
})
export class Guide implements OnInit {
  items: any[] = [];
  searchTerm = '';
  
  order: number = 0;
  name = '';
  address = '';
  language = '';
  date = '';
  spot = '';
  phone = '';
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  existingImageUrl: string | null = null;

  showForm = false;
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  message = '';
  error = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private service = inject(GuideService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.isEditing = false;
    this.editingId = null;
    
    // Calculate max display order + 1
    const maxOrder = this.items.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;

    this.name = '';
    this.address = '';
    this.language = '';
    this.date = '';
    this.spot = '';
    this.phone = '';
    this.imageFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.isEditing = false;
    this.editingId = null;
    this.order = 0;
    this.name = '';
    this.address = '';
    this.language = '';
    this.date = '';
    this.spot = '';
    this.phone = '';
    this.imageFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  editItem(item: any) {
    this.isEditing = true;
    this.editingId = item.id;
    this.order = item.displayorder || 0;
    this.name = item.name || '';
    this.address = item.address || '';
    this.language = item.language || '';
    this.date = item.validDate || '';
    this.spot = item.spot || '';
    this.phone = item.phone || '';
    this.imageFile = null;
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

  resetForm() {
    this.closeForm();
  }

  loadItems() {
    this.service.getGuides().subscribe({
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
      this.imageFile = event.target.files[0];
      if (this.imageFile) {
        this.imagePreviewUrl = URL.createObjectURL(this.imageFile);
      }
    }
  }

  onSubmit() {
    if (!this.order || !this.name || !this.address || !this.language || !this.date || !this.spot || !this.phone) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('order', this.order.toString());
    formData.append('name', this.name);
    formData.append('address', this.address);
    formData.append('language', this.language);
    formData.append('date', this.date);
    formData.append('spot', this.spot);
    formData.append('phone', this.phone);
    
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.isEditing && this.editingId !== null) {
      this.service.updateGuide(this.editingId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Guide updated successfully!';
          this.resetForm();
          this.loadItems();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.createGuide(formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Guide created successfully!';
          this.resetForm();
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
    this.confirmService.confirm('Are you sure you want to delete this guide?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteGuide(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
