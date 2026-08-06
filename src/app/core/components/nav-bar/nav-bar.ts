import { Component, signal, OnInit, OnDestroy, NgZone, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AccessibilityService } from '../../services/accessibility.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit, OnDestroy {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isTourPage = signal(false);
  isAccessibilityPanelOpen = signal(false);

  @ViewChild('navSearch') searchInput!: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Intercept Ctrl+F or Cmd+F
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault(); // Stop default browser search bar
      this.isAccessibilityPanelOpen.set(true); // Open the Quick Tools panel
      
      // Wait for Angular to render the panel, then focus the input
      setTimeout(() => {
        if (this.searchInput && this.searchInput.nativeElement) {
          this.searchInput.nativeElement.focus();
        }
      }, 0);
    }
  }

  private isDarkNavRoute(url: string): boolean {
    return url.startsWith('/tour/') || 
           url.startsWith('/dept-info/establishment/sihm') || 
           url.startsWith('/dept-info/establishment/tsm') ||
           url.startsWith('/best-packages');
  }

  constructor(private router: Router, public accessibility: AccessibilityService, private ngZone: NgZone) {
    this.isTourPage.set(this.isDarkNavRoute(this.router.url));
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isTourPage.set(this.isDarkNavRoute(event.urlAfterRedirects));
    });
  }

  isNavHidden = signal(false);
  private lastScrollY = 0;
  private scrollListener!: () => void;

  ngOnInit() {
    this.scrollListener = this.onScroll.bind(this);
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  onScroll() {
    const currentScrollY = window.scrollY;
    const newIsScrolled = currentScrollY > 50;
    
    let newIsNavHidden = this.isNavHidden();

    // Hide if scrolled past 150px
    if (currentScrollY > 150) {
      // Add a small threshold (5px) to prevent jitter on tiny scrolls
      if (currentScrollY > this.lastScrollY + 5) {
        newIsNavHidden = true; // Scrolling down -> hide
      } else if (currentScrollY < this.lastScrollY - 5) {
        newIsNavHidden = false; // Scrolling up -> show
      }
    } else {
      newIsNavHidden = false;
    }

    // Only trigger Angular change detection if values actually changed
    if (this.isScrolled() !== newIsScrolled || this.isNavHidden() !== newIsNavHidden) {
      this.ngZone.run(() => {
        this.isScrolled.set(newIsScrolled);
        this.isNavHidden.set(newIsNavHidden);
      });
    }

    this.lastScrollY = currentScrollY;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleAccessibilityPanel() {
    this.isAccessibilityPanelOpen.update(v => !v);
  }

  performSearch(query: string) {
    if (!query || typeof window === 'undefined') return;
    
    // Natively highlight and jump to text exactly like Ctrl+F
    const found = (window as any).find(query, false, false, true, false, false, false);
    
    // Close the panel after hitting enter if you want, but for now we leave it open so they can press Enter again for next match
  }

  clearSearch() {
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.value = '';
    }
    // Remove native browser selection if they clear the text
    if (typeof window !== 'undefined') {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }
}
