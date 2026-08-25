import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonialService } from '../../services/testimonial';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css']
})
export class TestimonialsComponent implements OnInit {
  items: any[] = [];
  searchTerm = '';

  name = '';
  designation = '';
  testimonial = '';
  rating = 5;
  order: number = 0;
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

  private service = inject(TestimonialService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.service.getTestimonials().subscribe({
      next: (res: any) => {
        this.items = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load testimonials.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddForm() {
    this.isEditing = false;
    this.editingId = null;
    this.name = '';
    this.designation = '';
    this.testimonial = '';
    this.rating = 5;

    // Calculate max display order + 1
    const maxOrder = this.items.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;

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
    this.error = '';
    this.cdr.detectChanges();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeForm();
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.imageFile as File);
    }
  }

  editItem(item: any) {
    this.isEditing = true;
    this.editingId = item.id;
    this.name = item.name;
    this.designation = item.designation;
    this.testimonial = item.testimonial;
    this.rating = item.rating;
    this.order = item.displayorder || 0;
    this.imageFile = null;
    this.imagePreviewUrl = null;
    this.existingImageUrl = item.image_url;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  setRating(value: number) {
    this.rating = value;
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.error = '';

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('designation', this.designation);
    formData.append('testimonial', this.testimonial);
    formData.append('rating', this.rating.toString());
    formData.append('displayorder', this.order.toString());
    
    if (this.imageFile) {
      formData.append('image_file', this.imageFile);
    }

    if (this.isEditing && this.editingId) {
      formData.append('_method', 'PUT'); // Spoof PUT request for Laravel multipart upload
      this.service.updateTestimonial(this.editingId, formData).subscribe({
        next: (res: any) => {
          this.message = 'Testimonial updated successfully!';
          this.loading = false;
          this.loadItems();
          setTimeout(() => {
            this.showForm = false;
            this.cdr.detectChanges();
          }, 1000);
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to update testimonial.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.createTestimonial(formData).subscribe({
        next: (res: any) => {
          this.message = 'Testimonial created successfully!';
          this.loading = false;
          this.loadItems();
          setTimeout(() => {
            this.showForm = false;
            this.cdr.detectChanges();
          }, 1000);
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to create testimonial.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this testimonial?').then((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.service.deleteTestimonial(id).subscribe({
          next: () => {
            this.loadItems();
          },
          error: () => {
            this.error = 'Failed to delete testimonial.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
