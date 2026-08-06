import { Component, signal, HostListener, AfterViewInit, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Scroll, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NavBar } from './core/components/nav-bar/nav-bar';
import { Footer } from './core/components/footer/footer';
import { SeoService } from './core/services/seo.service';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(15px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-15px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms 150ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimations]
})
export class App implements AfterViewInit, OnInit {
  protected readonly title = signal('tripura-tourism');
  showScrollToTop = signal(false);
  isAdminRoute = signal(false);
  
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private ngZone = inject(NgZone);
  private viewportScroller = inject(ViewportScroller);
  private seoService = inject(SeoService);
  private scrollListener!: () => void;

  ngOnInit() {
    // Manual scroll restoration: wait for route animations to complete before restoring position.
    // The built-in scrollPositionRestoration fires before animated content renders, clamping to top.
    this.router.events.pipe(
      filter((event): event is Scroll => event instanceof Scroll)
    ).subscribe(event => {
      if (event.position) {
        // Back/forward navigation (popstate): restore previous scroll position after animation
        document.documentElement.style.scrollBehavior = 'auto';
        void document.documentElement.offsetHeight;
        setTimeout(() => {
          this.viewportScroller.scrollToPosition(event.position!);
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth';
          }, 50);
        }, 600); // Wait for route animation to complete (400ms + 150ms delay + buffer)
      } else if (event.anchor) {
        // Anchor navigation
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(event.anchor!);
        }, 600);
      } else {
        // Forward/imperative navigation: scroll to top immediately
        document.documentElement.style.scrollBehavior = 'auto';
        void document.documentElement.offsetHeight;
        this.viewportScroller.scrollToPosition([0, 0]);
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 50);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const isAdmin = event.urlAfterRedirects.startsWith('/admin');
      this.isAdminRoute.set(isAdmin);
      
      if (typeof document !== 'undefined') {
        if (isAdmin) {
          document.body.classList.add('admin-body');
          document.body.classList.remove('public-body');
        } else {
          document.body.classList.add('public-body');
          document.body.classList.remove('admin-body');
        }
      }
      
      // Update SEO tags based on current route data
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      route.data.subscribe(data => {
        if (data['seo']) {
          this.seoService.updateTags(data['seo']);
        } else {
          this.seoService.updateTags({});
        }
      });
    });

    // Run scroll listener outside Angular to prevent change detection lag
    this.scrollListener = this.onScroll.bind(this);
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  ngAfterViewInit() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 600); // Wait for CSS transition to finish
      }, 100); // Tiny delay to ensure Angular paints first
    }
  }

  onScroll() {
    const shouldShow = window.scrollY > 300;
    if (this.showScrollToTop() !== shouldShow) {
      this.ngZone.run(() => {
        this.showScrollToTop.set(shouldShow);
      });
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.isActivated ? outlet.activatedRoute : '';
  }
}
