import { Component, signal, HostListener, AfterViewInit, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Scroll, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NavBar } from './core/components/nav-bar/nav-bar';
import { Footer } from './core/components/footer/footer';
import { SeoService } from './core/services/seo.service';
import { WordsPreloaderComponent } from './core/components/preloader/preloader';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import Lenis from 'lenis';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' })
    ], { optional: true }),
    query(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('250ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavBar, Footer, WordsPreloaderComponent],
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
  private lenis: any;
  private reqId: any;
  private resizeObserver: ResizeObserver | undefined;

  ngOnInit() {
    // Manual scroll restoration: wait for route animations to complete before restoring position.
    // The built-in scrollPositionRestoration fires before animated content renders, clamping to top.
    this.router.events.pipe(
      filter((event): event is Scroll => event instanceof Scroll)
    ).subscribe(event => {
      if (event.position) {
        setTimeout(() => {
          if (this.lenis) {
            this.lenis.scrollTo(event.position![1], { immediate: true });
          } else {
            this.viewportScroller.scrollToPosition(event.position!);
          }
        }, 150); // Reduced to match the 150ms leave animation
      } else if (event.anchor) {
        setTimeout(() => {
          if (this.lenis) {
            this.lenis.scrollTo('#' + event.anchor);
          } else {
            this.viewportScroller.scrollToAnchor(event.anchor!);
          }
        }, 150);
      } else {
        if (this.lenis) {
          this.lenis.scrollTo(0, { immediate: true });
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
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
          this.destroyLenis();
        } else {
          document.body.classList.add('public-body');
          document.body.classList.remove('admin-body');
          this.initLenis();
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

  private initLenis() {
    if (this.lenis || typeof document === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.reqId = requestAnimationFrame(raf);
      };

      this.reqId = requestAnimationFrame(raf);

      let resizeTimeout: any;
      this.resizeObserver = new ResizeObserver(() => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.lenis?.resize();
        }, 150);
      });
      this.resizeObserver.observe(document.body);
    });
  }

  private destroyLenis() {
    this.ngZone.runOutsideAngular(() => {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = undefined;
      }
      if (this.lenis) {
        this.lenis.destroy();
        this.lenis = undefined;
      }
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = undefined;
      }
    });
  }

  ngAfterViewInit() {
    // Global loader removal is now handled by WordsPreloaderComponent
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
    if (this.lenis) {
      this.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.isActivated ? outlet.activatedRoute : '';
  }
}
