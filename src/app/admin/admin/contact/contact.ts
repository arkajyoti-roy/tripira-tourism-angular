import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  items: any[] = [];
  searchTerm = '';
  
  name = '';
  phone = '';
  address = '';
  email = '';
  fax = '';
  
  editingId: number | null = null;
  showForm = false;

  loading = false;
  message = '';
  error = '';

  private service = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingId = null;
    this.name = '';
    this.phone = '';
    this.address = '';
    this.email = '';
    this.fax = '';
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.name = '';
    this.phone = '';
    this.address = '';
    this.email = '';
    this.fax = '';
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getContacts().subscribe({
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

  onSubmit() {
    if (!this.name) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.message = '';

    const payload = { 
      name: this.name, 
      phone: this.phone,
      address: this.address,
      email: this.email,
      fax: this.fax
    };

    if (this.editingId) {
      this.service.updateContact(this.editingId, payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Contact updated successfully!';
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
      this.service.createContact(payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = 'Contact created successfully!';
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

  editItem(item: any) {
    this.editingId = item.id;
    this.name = item.name;
    this.phone = item.phone;
    this.address = item.address;
    this.email = item.email;
    this.fax = item.fax;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  resetForm() {
    this.closeForm();
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this contact?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteContact(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
