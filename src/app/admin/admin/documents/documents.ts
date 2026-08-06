import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DocumentService } from '../../services/document';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';
import { FormsModule } from '@angular/forms';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './documents.html',
  styleUrls: ['./documents.css']
})
export class Documents implements OnInit {
  items: any[] = [];
  searchTerm = '';
  
  des = '';
  doctype = '';
  status = 1;
  whatsnew = 1;
  openDate = '';
  closeDate = '';
  selectedFile: File | null = null;
  selectedTypeFilter = '';

  get filteredItems(): any[] {
    if (!this.selectedTypeFilter) {
      return this.items;
    }
    return this.items.filter(item => item.doctype == this.selectedTypeFilter);
  }
  
  showForm = false;
  editingId: number | null = null;
  loading = false;
  message = '';
  error = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  docTypes = [
    { id: 1, name: 'Notification' },
    { id: 2, name: 'Tender' },
    { id: 3, name: 'Tripura Tourism Policy' },
    { id: 4, name: 'Ongoing Projects' },
    { id: 5, name: 'Guidelines' },
    { id: 6, name: 'Downloadable Forms' },
    { id: 7, name: 'Publication' },
    { id: 8, name: 'Brochure' },
    { id: 9, name: "Act's and Rules" },
    { id: 10, name: 'Recruitment' }
  ];

  statusOptions = [
    { id: 1, name: 'Enable' },
    { id: 2, name: 'Disable' }
  ];

  whatsNewOptions = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' }
  ];

  private service = inject(DocumentService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingId = null;
    this.des = '';
    this.doctype = '';
    this.status = 1;
    this.whatsnew = 1;
    this.openDate = '';
    this.closeDate = '';
    this.selectedFile = null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.des = '';
    this.doctype = '';
    this.status = 1;
    this.whatsnew = 1;
    this.openDate = '';
    this.closeDate = '';
    this.selectedFile = null;
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getDocuments().subscribe({
      next: (res) => {
        this.items = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  getDocTypeName(id: number): string {
    const found = this.docTypes.find(dt => dt.id == id);
    return found ? found.name : 'Unknown';
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (!this.doctype) {
      this.error = 'Document Type is required';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    const formData = new FormData();
    formData.append('des', this.des);
    formData.append('doctype', this.doctype);
    formData.append('status', this.status.toString());
    formData.append('whatsnew', this.whatsnew.toString());
    
    if (this.openDate) {
      formData.append('openDate', this.openDate);
    }
    
    if (this.closeDate) {
      formData.append('closeDate', this.closeDate);
    }
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.editingId) {
      this.service.updateDocument(this.editingId, formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Document updated successfully!';
          this.closeForm();
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
      this.service.createDocument(formData).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Document created successfully!';
          this.closeForm();
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

  editItem(item: any) {
    this.editingId = item.docid;
    this.des = item.des || '';
    this.doctype = item.doctype;
    this.status = item.status;
    this.whatsnew = item.whatsnew || 1;
    this.openDate = item.openDate ? this.formatDate(item.openDate) : '';
    this.closeDate = item.closeDate ? this.formatDate(item.closeDate) : '';
    this.selectedFile = null;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  formatDate(value: any): string {
    if (!value) return '';
    let date: Date;
    if (typeof value === 'number' || /^\d+$/.test(value)) {
      date = new Date(Number(value) * 1000);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFormattedDate(value: any): string {
    if (!value) return '-';
    let date: Date;
    if (typeof value === 'number' || /^\d+$/.test(value)) {
      date = new Date(Number(value) * 1000);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return '-';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  resetForm() {
    this.closeForm();
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this document?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteDocument(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error(err)
        });
      }
    });
  }
}
