import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevcorpService } from '../../services/devcorp';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-devcorp',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './devcorp.html',
  styleUrls: ['./devcorp.css']
})
export class Devcorp implements OnInit {
  items: any[] = [];
  searchTerm = '';
  
  order: number = 0;
  name = '';
  designation = '';
  address = '';
  phone = '';
  email = '';
  facebook = '';
  twitter = '';
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

  private service = inject(DevcorpService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.isEditing = false;
    this.editingId = null;
    const maxOrder = this.items.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;
    this.name = '';
    this.designation = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.facebook = '';
    this.twitter = '';
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
    this.designation = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.facebook = '';
    this.twitter = '';
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
    this.designation = item.designation || '';
    this.address = item.address || '';
    this.phone = item.phone || '';
    this.email = item.email || '';
    this.facebook = item.facebook || '';
    this.twitter = item.twitter || '';
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
    this.service.getDevcorps().subscribe({
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
    if (!this.order || !this.name || !this.designation || !this.address || !this.phone || !this.email) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('order', this.order.toString());
    formData.append('name', this.name);
    formData.append('designation', this.designation);
    formData.append('address', this.address);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('facebook', this.facebook);
    formData.append('twitter', this.twitter);
    
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.isEditing && this.editingId !== null) {
      this.service.updateDevcorp(this.editingId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Development Corporation member updated successfully!';
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
      this.service.createDevcorp(formData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Development Corporation member created successfully!';
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
    this.confirmService.confirm('Are you sure you want to delete this member?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteDevcorp(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
