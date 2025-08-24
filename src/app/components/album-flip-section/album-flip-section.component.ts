import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  signal,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { LOVE_QUOTES } from '../../shared/constants';

interface AlbumPage {
  id: number;
  quote: string;
  icon: string;
  isLast?: boolean;
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

@Component({
  selector: 'app-album-flip-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="album-section section" #albumSection>
      <div class="album-container">
        <h2 class="section-title">Our Story Album</h2>
        <p class="section-subtitle">Scroll to flip through the pages...</p>

        <div class="album-book" #albumBook>
          <div class="album-spine"></div>

          <div class="album-pages" #albumPagesContainer>
            <div
              class="album-page"
              *ngFor="let page of albumPages; let i = index"
              [class.active]="currentPage() === i"
              [style.transform]="getPageTransform(i)"
              [style.z-index]="getPageZIndex(i)"
              #albumPage
            >
              <div class="page-content" *ngIf="!page.isLast">
                <div class="page-icon">{{ page.icon }}</div>
                <div class="page-quote">"{{ page.quote }}"</div>
                <div class="page-number">{{ i + 1 }}</div>
              </div>

              <div class="final-page-content" *ngIf="page.isLast">
                <div class="final-icon">💖</div>
                <div class="final-text">The story continues...</div>
                <button class="heart-button" (click)="openHeart()" #heartButton>
                  Open my heart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="page-indicator">
          Page {{ currentPage() + 1 }} of {{ albumPages.length }}
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./album-flip-section.component.scss'],
})
export class AlbumFlipSectionComponent implements OnInit {
  @ViewChild('albumSection') albumSection!: ElementRef;
  @ViewChild('albumBook') albumBook!: ElementRef;
  @ViewChild('heartButton') heartButton!: ElementRef;

  currentPage = signal(0);
  private lastScrollY = 0;
  private isScrolling = false;
  private isBrowser: boolean;

  albumPages: AlbumPage[] = [
    { id: 1, quote: LOVE_QUOTES[0], icon: '🌹' },
    { id: 2, quote: LOVE_QUOTES[1], icon: '🌙' },
    { id: 3, quote: LOVE_QUOTES[2], icon: '⭐' },
    { id: 4, quote: LOVE_QUOTES[3], icon: '💫' },
    { id: 5, quote: LOVE_QUOTES[4], icon: '🦋' },
    { id: 6, quote: LOVE_QUOTES[5], icon: '🌸' },
    { id: 7, quote: 'Ready to open your heart?', icon: '💕', isLast: true },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => this.initScrollListener(), 200);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.isBrowser || !this.isInViewport()) return;

    event.preventDefault();

    if (this.isScrolling) return;
    this.isScrolling = true;

    const delta = event.deltaY;
    const currentPageValue = this.currentPage();

    if (delta > 0 && currentPageValue < this.albumPages.length - 1) {
      // Scroll down - next page
      this.flipToPage(currentPageValue + 1);
    } else if (delta < 0 && currentPageValue > 0) {
      // Scroll up - previous page
      this.flipToPage(currentPageValue - 1);
    }

    setTimeout(() => {
      this.isScrolling = false;
    }, 800);
  }

  getPageTransform(pageIndex: number): string {
    const current = this.currentPage();

    if (pageIndex <= current) {
      // Pages that have been flipped
      return `rotateY(-180deg)`;
    } else {
      // Pages that haven't been flipped yet
      return `rotateY(0deg)`;
    }
  }

  getPageZIndex(pageIndex: number): number {
    return this.albumPages.length - pageIndex;
  }

  private initScrollListener() {
    if (!this.isBrowser || !this.albumBook?.nativeElement) return;

    // Initial animation
    gsap.fromTo(
      this.albumBook.nativeElement,
      { opacity: 0, scale: 0.8 },
      { duration: 1, opacity: 1, scale: 1, ease: 'power2.out' }
    );
  }

  private flipToPage(pageIndex: number) {
    if (!this.isBrowser || pageIndex < 0 || pageIndex >= this.albumPages.length)
      return;

    this.currentPage.set(pageIndex);

    // Add flip sound effect (optional)
    this.playFlipSound();

    // Haptic feedback if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  private isInViewport(): boolean {
    if (!this.isBrowser || !this.albumSection?.nativeElement) return false;

    const rect = this.albumSection.nativeElement.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  private playFlipSound() {
    // Optional: Add a subtle page flip sound
    // This would require an audio file or Web Audio API
  }

  openHeart() {
    if (!this.isBrowser || !this.heartButton?.nativeElement) return;

    // Trigger finale section
    gsap.to(this.heartButton.nativeElement, {
      duration: 0.3,
      scale: 1.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => {
        // Scroll to finale section
        const finaleSection = document.querySelector('app-finale-section');
        if (finaleSection) {
          finaleSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
    });
  }
}
