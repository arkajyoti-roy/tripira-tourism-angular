import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccommodationService } from '../../services/accommodation';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-accommodation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accommodation.html',
  styleUrls: ['./accommodation.css']
})
export class Accommodation implements OnInit {
  items: any[] = [];
  name = '';
  description = '';
  type = '';
  contact = '';
  email = '';
  website = '';
  address = '';
  displayorder = 0;
  name_of_lessee = '';
  valid_upto = '';
  
  loading = false;
  message = '';
  error = '';
  
  showForm = false;
  isEditing = false;
  editId: number | null = null;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  existingImageUrl: string | null = null;
  searchTerm = '';
  selectedTypeFilter = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private service = inject(AccommodationService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.isEditing = false;
    this.editId = null;
    this.name = '';
    this.description = '';
    this.type = '';
    this.contact = '';
    this.email = '';
    this.website = '';
    this.address = '';
    this.displayorder = 1;
    this.name_of_lessee = '';
    this.valid_upto = '';
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onTypeChange() {
    if (!this.isEditing && this.type) {
      // Filter items matching selected type, then calculate max displayorder + 1
      const matchingItems = this.items.filter(item => String(item.type) === String(this.type));
      const maxOrder = matchingItems.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
      this.displayorder = maxOrder + 1;
    }
  }

  closeForm() {
    this.showForm = false;
    this.isEditing = false;
    this.editId = null;
    this.name = '';
    this.description = '';
    this.type = '';
    this.contact = '';
    this.email = '';
    this.website = '';
    this.address = '';
    this.displayorder = 0;
    this.name_of_lessee = '';
    this.valid_upto = '';
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  getFilteredItems() {
    let filtered = this.items;

    // Apply Type Filter
    if (this.selectedTypeFilter) {
      filtered = filtered.filter(item => String(item.type) === String(this.selectedTypeFilter));
    }

    // Apply Search Filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.address && item.address.toLowerCase().includes(term)) ||
        (item.contact && item.contact.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  loadItems() {
    this.service.getAccommodations().subscribe({
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

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imagePreviewUrl = URL.createObjectURL(this.selectedFile);
      }
    }
  }

  editItem(item: any) {
    this.isEditing = true;
    this.editId = item.id;
    this.name = item.name;
    this.description = item.description;
    this.type = item.type;
    this.contact = item.contact || '';
    this.email = item.email || '';
    this.website = item.website || '';
    this.address = item.address || '';
    this.displayorder = item.displayorder || 0;
    this.name_of_lessee = item.name_of_lessee || '';
    this.valid_upto = item.valid_upto || '';
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
    if (!this.name || !this.description || !this.type) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('type', this.type);
    formData.append('contact', this.contact);
    formData.append('email', this.email);
    formData.append('website', this.website);
    formData.append('address', this.address);
    formData.append('displayorder', String(this.displayorder));
    formData.append('name_of_lessee', this.name_of_lessee);
    formData.append('valid_upto', this.valid_upto);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editId) {
      this.service.updateAccommodation(this.editId, formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Accommodation updated successfully!';
          this.cancelEdit();
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
      this.service.createAccommodation(formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Accommodation created successfully!';
          this.closeForm();
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
    this.confirmService.confirm('Are you sure you want to delete this accommodation?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteAccommodation(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
