import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-portraits-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="portraits-section section" #portraitsSection>
      <div class="portraits-container">
        <h2 class="section-title">Under the Pink Moon</h2>

        <div class="portraits-grid">
          <div class="portrait left-portrait" #leftPortrait>
            <!-- Batman silhouette -->
            <svg class="portrait-svg" viewBox="0 0 200 300" #batmanSvg>
              <defs>
                <linearGradient
                  id="heroGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="var(--ink)" />
                  <stop offset="100%" stop-color="var(--midnight-purple)" />
                </linearGradient>
              </defs>
              <!-- Cape -->
              <path
                d="M40,80 Q20,100 30,200 L30,280 Q100,260 170,280 L170,200 Q180,100 160,80 Q140,70 120,75 Q100,60 80,75 Q60,70 40,80"
                fill="url(#heroGradient)"
                class="cape"
              />
              <!-- Body -->
              <ellipse
                cx="100"
                cy="150"
                rx="35"
                ry="80"
                fill="var(--ink)"
                class="body"
              />
              <!-- Head -->
              <circle cx="100" cy="90" r="25" fill="var(--ink)" class="head" />
              <!-- Bat ears -->
              <path
                d="M85,75 Q80,60 90,65 Q95,70 100,65 Q105,70 110,65 Q120,60 115,75"
                fill="var(--ink)"
                class="ears"
              />
              <!-- Eye glow -->
              <circle
                cx="95"
                cy="85"
                r="2"
                fill="var(--rose)"
                opacity="0.8"
                class="eye-glow"
              />
              <circle
                cx="105"
                cy="85"
                r="2"
                fill="var(--rose)"
                opacity="0.8"
                class="eye-glow"
              />
            </svg>
          </div>

          <div class="portrait right-portrait" #rightPortrait>
            <!-- Catwoman silhouette -->
            <svg class="portrait-svg" viewBox="0 0 200 300" #catwomanSvg>
              <defs>
                <linearGradient
                  id="thiefGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="var(--midnight-purple)" />
                  <stop offset="100%" stop-color="var(--ink)" />
                </linearGradient>
              </defs>
              <!-- Body silhouette -->
              <path
                d="M70,100 Q65,120 70,200 Q80,250 90,280 Q100,285 110,280 Q120,250 130,200 Q135,120 130,100 Q120,90 110,95 Q100,85 90,95 Q80,90 70,100"
                fill="url(#thiefGradient)"
                class="body"
              />
              <!-- Head -->
              <circle cx="100" cy="90" r="22" fill="var(--ink)" class="head" />
              <!-- Cat ears -->
              <path
                d="M85,75 Q82,65 88,70 Q92,75 96,70 Q104,75 108,70 Q118,65 115,75 Q110,80 105,75 Q100,85 95,75 Q90,80 85,75"
                fill="var(--ink)"
                class="cat-ears"
              />
              <!-- Eye glow -->
              <circle
                cx="95"
                cy="85"
                r="1.5"
                fill="var(--blush)"
                opacity="0.9"
                class="eye-glow"
              />
              <circle
                cx="105"
                cy="85"
                r="1.5"
                fill="var(--blush)"
                opacity="0.9"
                class="eye-glow"
              />
              <!-- Whip -->
              <path
                d="M130,150 Q160,170 180,200 Q170,210 150,190 Q140,180 135,160"
                stroke="var(--rose-gold)"
                stroke-width="2"
                fill="none"
                class="whip"
              />
            </svg>
          </div>
        </div>

        <div class="caption" #caption>
          <p>"Some heroes wear capes, some steal hearts."</p>
        </div>

        <!-- Pink moon -->
        <div class="pink-moon" #pinkMoon>
          <svg viewBox="0 0 120 120" width="100" height="100">
            <defs>
              <radialGradient id="moonGradient">
                <stop offset="0%" stop-color="var(--blush)" />
                <stop offset="70%" stop-color="var(--rose)" />
                <stop offset="100%" stop-color="var(--rose-gold)" />
              </radialGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="url(#moonGradient)"
              opacity="0.8"
            />
            <circle
              cx="45"
              cy="45"
              r="4"
              fill="var(--rose-gold)"
              opacity="0.6"
            />
            <circle
              cx="75"
              cy="40"
              r="3"
              fill="var(--rose-gold)"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="70"
              r="5"
              fill="var(--rose-gold)"
              opacity="0.4"
            />
            <circle
              cx="80"
              cy="75"
              r="2"
              fill="var(--rose-gold)"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./portraits-section.component.scss'],
})
export class PortraitsSectionComponent implements OnInit {
  @ViewChild('portraitsSection') portraitsSection!: ElementRef;
  @ViewChild('leftPortrait') leftPortrait!: ElementRef;
  @ViewChild('rightPortrait') rightPortrait!: ElementRef;
  @ViewChild('caption') caption!: ElementRef;
  @ViewChild('pinkMoon') pinkMoon!: ElementRef;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);
      setTimeout(() => this.initScrollTriggerAnimations(), 200);
    }
  }

  private initScrollTriggerAnimations() {
    if (
      !this.isBrowser ||
      !this.leftPortrait?.nativeElement ||
      !this.rightPortrait?.nativeElement
    )
      return;

    // Initial states
    gsap.set(
      [this.leftPortrait.nativeElement, this.rightPortrait.nativeElement],
      {
        x: (index) => (index === 0 ? -100 : 100),
        opacity: 0,
      }
    );

    if (this.caption?.nativeElement) {
      gsap.set(this.caption.nativeElement, { opacity: 0, y: 30 });
    }

    // Scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.portraitsSection.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to([this.leftPortrait.nativeElement, this.rightPortrait.nativeElement], {
      duration: 1,
      x: 0,
      opacity: 1,
      ease: 'power2.out',
      stagger: 0.3,
    });

    if (this.caption?.nativeElement) {
      tl.to(
        this.caption.nativeElement,
        {
          duration: 0.8,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }

    // Hover animations for embrace effect
    this.setupHoverAnimations();

    // Moon floating animation
    if (this.pinkMoon?.nativeElement) {
      gsap.to(this.pinkMoon.nativeElement, {
        duration: 4,
        y: -20,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut',
      });
    }
  }

  private setupHoverAnimations() {
    if (!this.isBrowser || !this.portraitsSection?.nativeElement) return;

    const portraitsGrid =
      this.portraitsSection.nativeElement.querySelector('.portraits-grid');
    if (!portraitsGrid) return;

    portraitsGrid.addEventListener('mouseenter', () => {
      // Move portraits closer together
      if (this.leftPortrait?.nativeElement) {
        gsap.to(this.leftPortrait.nativeElement, {
          duration: 0.8,
          x: 50,
          ease: 'power2.out',
        });
      }

      if (this.rightPortrait?.nativeElement) {
        gsap.to(this.rightPortrait.nativeElement, {
          duration: 0.8,
          x: -50,
          ease: 'power2.out',
        });
      }

      // Enhance eye glow
      gsap.to('.eye-glow', {
        duration: 0.5,
        opacity: 1,
        scale: 1.5,
        ease: 'power2.out',
      });
    });

    portraitsGrid.addEventListener('mouseleave', () => {
      // Return to original positions
      if (
        this.leftPortrait?.nativeElement &&
        this.rightPortrait?.nativeElement
      ) {
        gsap.to(
          [this.leftPortrait.nativeElement, this.rightPortrait.nativeElement],
          {
            duration: 0.8,
            x: 0,
            ease: 'power2.out',
          }
        );
      }

      // Reset eye glow
      gsap.to('.eye-glow', {
        duration: 0.5,
        opacity: 0.8,
        scale: 1,
        ease: 'power2.out',
      });
    });
  }
}
