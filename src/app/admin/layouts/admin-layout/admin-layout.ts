import { Component, inject, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {
  isSidebarOpen = true;
  previewImageUrl: string | null = null;

  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth > 768;
    }
  }

  @HostListener('click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      if (img.classList.contains('header-logo') || img.classList.contains('no-zoom')) {
        return;
      }
      this.previewImageUrl = img.src;
      this.cdr.detectChanges();
    }
  }

  closePreview() {
    this.previewImageUrl = null;
    this.cdr.detectChanges();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path).then(() => this.onNavLinkClick());
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  private onNavLinkClick() {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}
