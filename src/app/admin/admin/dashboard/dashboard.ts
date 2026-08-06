import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: any = {
    photos: 0,
    tours: 0,
    accommodations: 0,
    guides: 0,
    adventures: 0,
    agents: 0,
    documents: 0,
    testimonials: 0,
    visitors: 0,
    today_visitors: 0,
    recent_logs: []
  };

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.cdr.detectChanges();
    this.dashboardService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatLogAction(action: string): string {
    if (!action) return '';
    return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getLogBadgeClass(action: string): string {
    if (action.includes('create') || action.includes('store') || action.includes('add')) return 'badge-success';
    if (action.includes('delete') || action.includes('destroy') || action.includes('remove')) return 'badge-danger';
    if (action.includes('update') || action.includes('edit')) return 'badge-warning';
    return 'badge-info';
  }
}
