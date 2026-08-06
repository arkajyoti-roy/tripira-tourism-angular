import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TouristCategoryService } from '../../services/tourist-category';
import { environment } from '../../../../environments/environment';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-tourist-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tourist-category.html',
  styleUrls: ['./tourist-category.css']
})
export class TouristCategory implements OnInit {
  environment = environment;
  categories: any[] = [];
  name = '';
  description = '';
  order = 0;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  existingImageUrl: string | null = null;
  loading = false;
  message = '';
  error = '';
  
  isEditing = false;
  editId: number | null = null;
  showForm = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private categoryService = inject(TouristCategoryService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadCategories();
  }

  openAddForm() {
    this.isEditing = false;
    this.editId = null;
    const maxOrder = this.categories.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;
    this.name = '';
    this.description = '';
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
    this.isEditing = false;
    this.editId = null;
    this.order = 0;
    this.name = '';
    this.description = '';
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  editCategory(cat: any) {
    this.isEditing = true;
    this.editId = cat.id;
    this.order = cat.displayorder || 0;
    this.name = cat.name;
    this.description = cat.description;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = cat.image ? `${environment.baseUrl}/images/slider/${cat.image}` : null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }
  
  cancelEdit() {
    this.closeForm();
  }

  getFilteredCategories() {
    if (!this.searchTerm.trim()) return this.categories;
    const term = this.searchTerm.toLowerCase().trim();
    this.currentPage = 1;
    const filtered = this.categories.filter(cat => 
      (cat.name && cat.name.toLowerCase().includes(term)) ||
      (cat.description && cat.description.toLowerCase().includes(term))
    );
    return filtered;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        const all = Array.isArray(data) ? data : [];
        this.categories = all.filter(
          (cat: any) => cat && (cat.name || cat.image)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
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

  onSubmit() {
    if (!this.name || !this.description || !this.order) {
      this.error = 'Please fill all required fields.';
      return;
    }
    if (!this.isEditing && !this.selectedFile) {
      this.error = 'Please select an image when creating.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('order', this.order.toString());
    formData.append('name', this.name);
    formData.append('description', this.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editId) {
      this.categoryService.updateCategory(this.editId, formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Tourist category updated successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadCategories();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Tourist category created successfully!';
          this.closeForm();
          this.cdr.detectChanges();
          this.loadCategories();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteCategory(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this category?').then((confirmed) => {
      if (confirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => {
            console.error('Delete failed', err);
          }
        });
      }
    });
  }
}

