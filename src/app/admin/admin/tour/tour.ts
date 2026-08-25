import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../services/tour';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour.html',
  styleUrls: ['./tour.css']
})
export class Tour implements OnInit {
  environment = environment;
  tours: any[] = [];
  categories: any[] = [];
  districts: any[] = [];
  
  category = '';
  destype = '1';
  district = '';
  name = '';
  description = '';
  location = '';
  map = '';
  phone = '';
  accommodation = '';
  order = 0;
  
  imageFile: File | null = null;
  image2File: File | null = null;
  image3File: File | null = null;
  image4File: File | null = null;
  image5File: File | null = null;
  image6File: File | null = null;
  image7File: File | null = null;
  imagePreviewUrl: string | null = null;
  image2PreviewUrl: string | null = null;
  image3PreviewUrl: string | null = null;
  image4PreviewUrl: string | null = null;
  image5PreviewUrl: string | null = null;
  image6PreviewUrl: string | null = null;
  image7PreviewUrl: string | null = null;
  existingImageUrl: string | null = null;
  existingImage2Url: string | null = null;
  existingImage3Url: string | null = null;
  existingImage4Url: string | null = null;
  existingImage5Url: string | null = null;
  existingImage6Url: string | null = null;
  existingImage7Url: string | null = null;

  isEditing = false;
  editingId: number | null = null;
  showForm = false;
  loading = false;
  message = '';
  error = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private tourService = inject(TourService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadTours();
    this.loadCategories();
    this.loadDistricts();
  }

  openAddForm() {
    this.isEditing = false;
    this.editingId = null;
    const maxOrder = this.tours.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;
    this.category = '';
    this.destype = '1';
    this.district = '';
    this.name = '';
    this.description = '';
    this.location = '';
    this.map = '';
    this.phone = '';
    this.accommodation = '';
    this.imageFile = null;
    this.image2File = null;
    this.image3File = null;
    this.image4File = null;
    this.image5File = null;
    this.image6File = null;
    this.image7File = null;
    this.imagePreviewUrl = null;
    this.image2PreviewUrl = null;
    this.image3PreviewUrl = null;
    this.image4PreviewUrl = null;
    this.image5PreviewUrl = null;
    this.image6PreviewUrl = null;
    this.image7PreviewUrl = null;
    this.existingImageUrl = null;
    this.existingImage2Url = null;
    this.existingImage3Url = null;
    this.existingImage4Url = null;
    this.existingImage5Url = null;
    this.existingImage6Url = null;
    this.existingImage7Url = null;
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
    this.description = '';
    this.category = '';
    this.district = '';
    this.location = '';
    this.map = '';
    this.phone = '';
    this.accommodation = '';
    this.imageFile = null;
    this.image2File = null;
    this.image3File = null;
    this.image4File = null;
    this.image5File = null;
    this.image6File = null;
    this.image7File = null;
    this.imagePreviewUrl = null;
    this.image2PreviewUrl = null;
    this.image3PreviewUrl = null;
    this.image4PreviewUrl = null;
    this.image5PreviewUrl = null;
    this.image6PreviewUrl = null;
    this.image7PreviewUrl = null;
    this.existingImageUrl = null;
    this.existingImage2Url = null;
    this.existingImage3Url = null;
    this.existingImage4Url = null;
    this.existingImage5Url = null;
    this.existingImage6Url = null;
    this.existingImage7Url = null;
    this.message = '';
    this.error = '';
    this.cdr.detectChanges();
  }

  editTour(item: any) {
    this.isEditing = true;
    this.editingId = item.id;
    this.order = item.displayorder || 0;
    this.category = item.category || '';
    this.destype = item.destype || '1';
    this.district = item.district || '';
    this.name = item.name || '';
    this.description = item.description || '';
    this.location = item.location || '';
    this.map = item.map || '';
    this.phone = item.phone || '';
    this.accommodation = item.accommodation || '';
    this.imageFile = null;
    this.image2File = null;
    this.image3File = null;
    this.image4File = null;
    this.image5File = null;
    this.image6File = null;
    this.image7File = null;
    this.imagePreviewUrl = null;
    this.image2PreviewUrl = null;
    this.image3PreviewUrl = null;
    this.image4PreviewUrl = null;
    this.image5PreviewUrl = null;
    this.image6PreviewUrl = null;
    this.image7PreviewUrl = null;
    const folderPath = item.folder ? `${item.folder}/` : '';
    this.existingImageUrl = item.image ? `${environment.baseUrl}/images/tour/${folderPath}${item.image}` : null;
    this.existingImage2Url = item.image2 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image2}` : null;
    this.existingImage3Url = item.image3 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image3}` : null;
    this.existingImage4Url = item.image4 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image4}` : null;
    this.existingImage5Url = item.image5 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image5}` : null;
    this.existingImage6Url = item.image6 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image6}` : null;
    this.existingImage7Url = item.image7 ? `${environment.baseUrl}/images/tour/${folderPath}${item.image7}` : null;
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

  getFilteredTours() {
    if (!this.searchTerm.trim()) return this.tours;
    const term = this.searchTerm.toLowerCase().trim();
    this.currentPage = 1;
    return this.tours.filter(item => 
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term)) ||
      (item.location && item.location.toLowerCase().includes(term))
    );
  }

  loadTours() {
    this.tourService.getTours().subscribe({
      next: (data: any) => {
        this.tours = Array.isArray(data) ? data : data.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load tours', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.adminApiUrl}/admin/tourist-category`).subscribe({
      next: (data: any) => {
        this.categories = Array.isArray(data) ? data : data.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  loadDistricts() {
    this.districts = [
      { did: '1', dname: 'West Tripura' },
      { did: '2', dname: 'North Tripura' },
      { did: '3', dname: 'South Tripura' },
      { did: '4', dname: 'Dhalai' },
      { did: '5', dname: 'Gomati' },
      { did: '6', dname: 'Khowai' },
      { did: '7', dname: 'Sepahijala' },
      { did: '8', dname: 'Unakoti' }
    ];
  }

  onFileChange(event: any, num: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (num === 1) {
        this.imageFile = file;
        this.imagePreviewUrl = URL.createObjectURL(file);
      }
      if (num === 2) {
        this.image2File = file;
        this.image2PreviewUrl = URL.createObjectURL(file);
      }
      if (num === 3) {
        this.image3File = file;
        this.image3PreviewUrl = URL.createObjectURL(file);
      }
      if (num === 4) {
        this.image4File = file;
        this.image4PreviewUrl = URL.createObjectURL(file);
      }
      if (num === 5) {
        this.image5File = file;
        this.image5PreviewUrl = URL.createObjectURL(file);
      }
      if (num === 6) {
        this.image6File = file;
        this.image6PreviewUrl = URL.createObjectURL(file);
      }
      if (num === 7) {
        this.image7File = file;
        this.image7PreviewUrl = URL.createObjectURL(file);
      }
    }
  }

  onSubmit() {
    if (!this.name || !this.description || !this.category || !this.destype || !this.location || !this.phone || !this.order) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    formData.append('order', this.order.toString());
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('destype', this.destype);
    formData.append('district', this.district);
    formData.append('location', this.location);
    formData.append('map', this.map);
    formData.append('phone', this.phone);
    formData.append('accommodation', this.accommodation);

    if (this.imageFile) formData.append('image', this.imageFile);
    if (this.image2File) formData.append('image2', this.image2File);
    if (this.image3File) formData.append('image3', this.image3File);
    if (this.image4File) formData.append('image4', this.image4File);
    if (this.image5File) formData.append('image5', this.image5File);
    if (this.image6File) formData.append('image6', this.image6File);
    if (this.image7File) formData.append('image7', this.image7File);

    if (this.isEditing && this.editingId !== null) {
      this.tourService.updateTour(this.editingId, formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Tour updated successfully!';
          this.resetForm();
          this.loadTours();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.tourService.createTour(formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Tour created successfully!';
          this.resetForm();
          this.loadTours();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Something went wrong.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteTour(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this tour?').then((confirmed) => {
      if (confirmed) {
        this.tourService.deleteTour(id).subscribe({
          next: () => {
            this.loadTours();
          },
          error: (err) => {
            console.error('Delete failed', err);
          }
        });
      }
    });
  }

  getDistrictName(did: any): string {
    if (!did) return 'N/A';
    const d = this.districts.find(x => x.did == did);
    return d ? d.dname : did;
  }

  toggleHomepageVisibility(item: any) {
    this.http.post<any>(`${environment.adminApiUrl}/admin/tours/${item.id}/toggle-home`, {}).subscribe({
      next: (res) => {
        item.show_on_homepage = res.show_on_homepage;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to toggle homepage visibility', err);
      }
    });
  }
}

