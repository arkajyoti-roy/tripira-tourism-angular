import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsService } from '../../services/logs';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-logs.html',
  styleUrls: ['./activity-logs.css']
})
export class ActivityLogs implements OnInit {
  logs: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 30;
  Math = Math;

  private logsService = inject(LogsService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.cdr.detectChanges();

    this.logsService.getLogs().subscribe({
      next: (res: any) => {
        this.logs = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load activity logs.';
        this.cdr.detectChanges();
      }
    });
  }

  getFilteredLogs() {
    if (!this.searchTerm) {
      return this.logs;
    }
    const term = this.searchTerm.toLowerCase();
    return this.logs.filter(log => 
      (log.admin_email && log.admin_email.toLowerCase().includes(term)) ||
      (log.action_type && log.action_type.toLowerCase().includes(term)) ||
      (log.section && log.section.toLowerCase().includes(term)) ||
      (log.resource && log.resource.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term))
    );
  }

  getPaginatedLogs() {
    const filtered = this.getFilteredLogs();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.getFilteredLogs().length / this.pageSize) || 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  formatDetails(details: string): string {
    if (!details) return 'No parameters logged';
    
    // Check if details is a JSON string
    if (details.trim().startsWith('{') || details.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(details);
        // Handle standard payload wrap
        const data = parsed.payload !== undefined ? parsed.payload : parsed;
        if (typeof data === 'object' && data !== null) {
          const list: string[] = [];
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const val = data[key];
              const displayVal = typeof val === 'object' ? JSON.stringify(val) : val;
              list.push(`${key}: ${displayVal}`);
            }
          }
          return list.length > 0 ? list.join('\n') : 'No payload parameters sent';
        }
      } catch (e) {}
    }

    // Format pipe-separated values to line breaks
    return details.replace(/\s*\|\s*/g, '\n');
  }

  formatDetailsLines(details: string): string[] {
    return this.formatDetails(details).split('\n').filter(line => line.trim().length > 0);
  }
}
