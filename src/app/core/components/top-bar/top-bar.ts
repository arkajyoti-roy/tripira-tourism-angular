import { Component, HostListener, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  isScrolled = signal(false);
  isTourPage = signal(false);
  searchActive = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private isDarkNavRoute(url: string): boolean {
    return url.startsWith('/tour/') || 
           url.startsWith('/dept-info/establishment/sihm') || 
           url.startsWith('/dept-info/establishment/tsm') ||
           url.startsWith('/best-packages');
  }

  constructor(private router: Router, public accessibility: AccessibilityService) {
    this.isTourPage.set(this.isDarkNavRoute(this.router.url));
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isTourPage.set(this.isDarkNavRoute(event.urlAfterRedirects));
      // Close search on navigation
      if (this.searchActive()) {
        this.searchActive.set(false);
      }
    });
  }

  toggleSearch() {
    this.searchActive.set(!this.searchActive());
    if (this.searchActive()) {
      setTimeout(() => {
        if (this.searchInput?.nativeElement) {
          this.searchInput.nativeElement.focus();
        }
      }, 50);
    } else {
      if (this.searchInput?.nativeElement) {
        this.searchInput.nativeElement.value = '';
      }
      // Clear selection when closing search
      if (typeof window !== 'undefined') {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
        }
      }
    }
  }

  performSearch(query: string) {
    if (!query || typeof window === 'undefined') return;
    
    // window.find acts natively exactly like Ctrl+F
    // (aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog)
    const found = (window as any).find(query, false, false, true, false, false, false);
    
    if (!found) {
      // Optional: Give some visual feedback that text wasn't found.
      // But just failing silently is identical to standard browser behavior on some platforms.
      const el = this.searchInput.nativeElement;
      el.style.color = '#ef4444'; // red text to indicate not found
      setTimeout(() => el.style.color = '', 1000);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 50);
    }
  }
}
