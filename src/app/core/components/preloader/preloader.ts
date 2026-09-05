import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, signal, QueryList, ViewChildren, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-words-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #preloaderContainer class="fixed inset-0 z-[99999] bg-[#111] flex items-center justify-center overflow-hidden origin-top transform-gpu pointer-events-none">
      
      <!-- Background Video -->
      <video #bgVideo loop muted playsinline class="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 transform-gpu will-change-opacity pointer-events-none">
        <source src="https://res.cloudinary.com/drtvxt1v3/video/upload/ac_none/v1784272058/Untitled_design_6_wzg0xu.mp4" type="video/mp4">
      </video>

      <!-- Dark Overlay -->
      <div #overlay class="absolute top-0 left-0 w-full h-full bg-[#0a0a0a]/80 z-[1] opacity-0 transform-gpu will-change-opacity pointer-events-none"></div>

      <!-- Center Logo (Appears during the final word) -->
      <div #logo class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10] opacity-0 pointer-events-none transform-gpu will-change-transform">
        <img src="tourism_new_logo5.webp" alt="Tripura Tourism" class="h-[clamp(140px,25vh,260px)] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] transform-gpu">
      </div>

      <!-- Main Content -->
      <div class="relative z-[2] w-full h-full flex flex-col justify-center items-center py-[5vh] pointer-events-none">
        
        <!-- Center Stack -->
        <div class="flex flex-col items-center justify-center flex-grow w-full gap-[3vh]">
          
          <!-- Image Container (High-Performance Masking Removed for Speed) -->
          <div #imageContainer class="relative w-[min(85vw,55vh)] max-w-[700px] aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 scale-95 transform-gpu will-change-transform pointer-events-none">
            <ng-container *ngFor="let item of slides; let i = index">
              <!-- All images start invisible -->
              <img #slideImages [src]="item.img" [attr.fetchpriority]="i < 3 ? 'high' : 'auto'" class="absolute top-0 left-0 w-full h-full object-cover opacity-0 transform-gpu will-change-opacity pointer-events-none">
            </ng-container>
          </div>

          <!-- Words Container -->
          <div class="relative flex flex-col items-center justify-center overflow-hidden h-[80px] md:h-[120px] w-full mt-2 pointer-events-none">
            <div #wordWrapper class="flex items-center justify-center drop-shadow-xl transform-gpu will-change-transform pointer-events-none">
              <h1 class="text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-light text-white uppercase tracking-[1.5vw] leading-none" style="font-family: 'Poppins', sans-serif;">
                {{ slides[0].word }}
              </h1>
            </div>
          </div>
        </div>

        <!-- Progress Bar at bottom -->
        <div class="relative mt-[2vh] w-[200px] flex flex-col items-center opacity-0 transform-gpu will-change-opacity pointer-events-none" #progressContainer>
          <span class="text-[9px] tracking-[4px] text-white/70 mb-[10px] uppercase font-medium">Discovering Tripura</span>
          <div class="w-full h-[1px] bg-white/10 relative overflow-hidden rounded-full transform-gpu">
            <div #progressBar class="absolute top-0 left-0 h-full w-full bg-white -translate-x-full transform-gpu will-change-transform"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WordsPreloaderComponent implements AfterViewInit {
  @ViewChild('preloaderContainer') preloaderContainer!: ElementRef;
  @ViewChild('bgVideo') bgVideo!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('logo') logo!: ElementRef;
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChild('wordWrapper') wordWrapper!: ElementRef;
  @ViewChild('progressContainer') progressContainer!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;
  @ViewChildren('slideImages') slideImages!: QueryList<ElementRef>;
  
  private ngZone = inject(NgZone);
  
  slides = [
    { word: "Heritage", img: "explore-tripura/a01037e8-78ab-4a13-a5e9-f344660d9151.webp" },
    { word: "Devotion", img: "explore-tripura/8b3f757e-8284-4f78-8e52-f6e1c7c3d575.webp" },
    { word: "Culture", img: "explore-tripura/6733297.webp" },
    { word: "Serenity", img: "explore-tripura/khowai.webp" },
    { word: "Wildlife", img: "explore-tripura/sepahijala.webp" },
    { word: "Tripura", img: "explore-tripura/a6f2b545-4591-41ae-855b-5b2d04c6acdf.webp" }
  ];
  
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(async () => {
      
      // 1. Force video playback and wait for it to be ready
      const videoReadyPromise = new Promise<void>((resolve) => {
        const vid = this.bgVideo?.nativeElement;
        if (!vid) return resolve();
        
        vid.muted = true;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch((e: any) => console.log('Video autoplay blocked:', e));
        }

        if (vid.readyState >= 3) {
          resolve();
        } else {
          vid.oncanplay = () => resolve();
          vid.onloadeddata = () => resolve();
          // Fallback if video takes too long to load
          setTimeout(resolve, 1500);
        }
      });

      // 2. Wait for all images to fully decode into GPU memory
      const slideElements = this.slideImages.toArray().map(el => el.nativeElement as HTMLImageElement);
      const decodePromises = slideElements.map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            img.decode().then(() => resolve()).catch(() => resolve());
          } else {
            img.onload = () => img.decode().then(() => resolve()).catch(() => resolve());
            img.onerror = () => resolve();
          }
        });
      });

      const imageTimeoutPromise = new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Wait for both video AND images to be ready
      await Promise.all([
        videoReadyPromise,
        Promise.race([Promise.all(decodePromises), imageTimeoutPromise])
      ]);
      
      // 3. Double requestAnimationFrame: The ultimate fix for "startup jitter".
      // This forces the browser to commit all the heavy DOM changes and initial paints
      // before we drop the heavy GSAP timeline on it.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Remove static loader ONLY at the last millisecond
          const staticLoader = document.getElementById('global-loader');
          if (staticLoader) {
            staticLoader.remove();
          }
          // Start the flawless timeline
          this.animatePreloader();
        });
      });
    });
  }

  animatePreloader() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.preloaderContainer.nativeElement.remove();
      }
    });

    const slideDuration = 0.85; 
    const totalDuration = this.slides.length * slideDuration; 

    // Smooth entry for background and structure
    tl.to([this.bgVideo.nativeElement, this.overlay.nativeElement], {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
      force3D: true 
    }, 0);

    tl.to(this.imageContainer.nativeElement, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "expo.out",
      force3D: true
    }, 0.2);

    tl.to(this.progressContainer.nativeElement, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      force3D: true
    }, 0.3);

    tl.to(this.progressBar.nativeElement, {
      x: "0%",
      duration: totalDuration,
      ease: "none",
      force3D: true
    }, 0.3);
    
    const slideElements = this.slideImages.toArray();

    // Word and Image Sequence
    this.slides.forEach((slide, index) => {
      const isLast = index === this.slides.length - 1;
      const startTime = 0.3 + (index * slideDuration); 

      // Ultimate Optimization: Update text via raw DOM API. 
      // This completely bypasses Angular's change detection engine, which was stalling the main thread!
      tl.call(() => {
        const h1 = this.wordWrapper.nativeElement.querySelector('h1');
        if (h1) h1.innerText = slide.word;
      }, undefined, startTime);

      // Typography animation: Extremely crisp snap up
      tl.fromTo(this.wordWrapper.nativeElement, 
        { yPercent: 50, opacity: 0, skewY: 4, letterSpacing: '2vw' },
        { yPercent: 0, opacity: 1, skewY: 0, letterSpacing: '1vw', duration: 0.6, ease: "power4.out", force3D: true },
        startTime
      );
      
      if (!isLast) {
        tl.to(this.wordWrapper.nativeElement, {
          yPercent: -50, opacity: 0, skewY: -4, duration: 0.35, ease: "power3.in", force3D: true
        }, startTime + slideDuration - 0.15); 
      } else {
        // Grand Finale: "Tripura" appears, Logo violently drops into center
        tl.fromTo(this.logo.nativeElement,
          { opacity: 0, scale: 0.3, yPercent: 80 },
          { opacity: 1, scale: 1, yPercent: -50, duration: 1.2, ease: "back.out(1.2)", force3D: true },
          startTime + 0.1
        );

        // Hide the background image so it doesn't clash with the logo, but keep the TRIPURA text
        tl.to(this.imageContainer.nativeElement, {
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true
        }, startTime + 0.1);
        
        // We don't darken the overlay here anymore, keeping background consistent
      }

      // Image animation: Super smooth pure fade
      tl.to(slideElements[index].nativeElement, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        force3D: true
      }, startTime);

      if (index > 0) {
        tl.to(slideElements[index - 1].nativeElement, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          force3D: true
        }, startTime);
      }
    });

    // Hold briefly
    tl.to({}, { duration: 0.5 });

    // Logo shoots up elegantly (faster)
    tl.to(this.logo.nativeElement, {
      yPercent: -250,
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      force3D: true
    });

    // Screen completely peels away
    tl.to(this.preloaderContainer.nativeElement, {
      yPercent: -100,
      duration: 1.0,
      ease: "expo.inOut",
      borderBottomLeftRadius: "15vw",
      borderBottomRightRadius: "15vw",
      force3D: true
    }, "-=0.5");
  }
}
