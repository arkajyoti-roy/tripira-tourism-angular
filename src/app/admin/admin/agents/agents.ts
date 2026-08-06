import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentsService } from '../../services/agents';
import { ConfirmService } from '../../services/confirm.service';
import { TableSearchPipe } from '../../core/pipes/table-search.pipe';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, TableSearchPipe],
  templateUrl: './agents.html',
  styleUrls: ['./agents.css']
})
export class Agents implements OnInit {
  items: any[] = [];
  searchTerm = '';
  
  order: number = 0;
  name = '';
  address = '';
  email = '';
  date = '';
  phone = '';
  
  showForm = false;
  editingId: number | null = null;
  loading = false;
  message = '';
  error = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private service = inject(AgentsService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadItems();
  }

  openAddForm() {
    this.editingId = null;
    
    // Calculate max display order + 1
    const maxOrder = this.items.reduce((max, item) => Math.max(max, item.displayorder || 0), 0);
    this.order = maxOrder + 1;

    this.name = '';
    this.address = '';
    this.email = '';
    this.date = '';
    this.phone = '';
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.order = 0;
    this.name = '';
    this.address = '';
    this.email = '';
    this.date = '';
    this.phone = '';
    this.error = '';
    this.cdr.detectChanges();
  }

  loadItems() {
    this.service.getAgents().subscribe({
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
    if (!this.order || !this.name) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const payload = {
      displayorder: this.order,
      name: this.name,
      address: this.address || null,
      email: this.email || null,
      validDate: this.date || null,
      phone: this.phone || null
    };

    if (this.editingId) {
      this.service.updateAgent(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Agent updated successfully!';
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
      this.service.createAgent(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Agent created successfully!';
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
    this.editingId = item.id;
    this.order = item.displayorder;
    this.name = item.name;
    this.address = item.address;
    this.email = item.email;
    this.date = item.validDate;
    this.phone = item.phone;
    this.message = '';
    this.error = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  resetForm() {
    this.closeForm();
  }

  deleteItem(id: number) {
    this.confirmService.confirm('Are you sure you want to delete this agent?').then((confirmed) => {
      if (confirmed) {
        this.service.deleteAgent(id).subscribe({
          next: () => this.loadItems(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }
}
