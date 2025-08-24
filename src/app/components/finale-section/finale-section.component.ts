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
  selector: 'app-finale-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="finale-section section" #finaleSection>
      <div class="finale-container">
        <!-- Animated background stars -->
        <div class="stars-container" #starsContainer>
          <div
            class="star"
            *ngFor="let star of stars; let i = index"
            [style.left.%]="star.x"
            [style.top.%]="star.y"
            [style.animation-delay.s]="star.delay"
          >
            ✨
          </div>
        </div>

        <!-- Flying heart with wings -->
        <div class="flying-heart-container" #flyingHeartContainer>
          <div class="flying-heart" #flyingHeart>
            <svg
              class="heart-wings"
              viewBox="0 0 200 120"
              width="200"
              height="120"
            >
              <defs>
                <radialGradient id="wingGradient" cx="50%" cy="50%">
                  <stop
                    offset="0%"
                    stop-color="var(--blush)"
                    stop-opacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stop-color="var(--white)"
                    stop-opacity="0.3"
                  />
                </radialGradient>
                <radialGradient id="heartGradient" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="var(--rose)" />
                  <stop offset="100%" stop-color="var(--blush)" />
                </radialGradient>
              </defs>

              <!-- Left wing -->
              <path
                class="wing left-wing"
                d="M20,60 Q10,30 40,45 Q60,55 50,70 Q40,65 20,60"
                fill="url(#wingGradient)"
                opacity="0.7"
              />

              <!-- Right wing -->
              <path
                class="wing right-wing"
                d="M180,60 Q190,30 160,45 Q140,55 150,70 Q160,65 180,60"
                fill="url(#wingGradient)"
                opacity="0.7"
              />

              <!-- Heart body -->
              <path
                class="heart-body"
                d="M100,45 C95,35 85,35 85,45 C85,35 75,35 80,45 C85,65 100,80 100,80 C100,80 115,65 120,45 C125,35 115,35 115,45 C115,35 105,35 100,45"
                fill="url(#heartGradient)"
              />

              <!-- Heart glow -->
              <circle
                cx="100"
                cy="55"
                r="25"
                fill="var(--rose)"
                opacity="0.3"
                class="heart-glow"
              />
            </svg>

            <!-- Sparkle trail -->
            <div class="sparkle-trail" #sparkleTrail>
              <div class="sparkle" *ngFor="let sparkle of sparkles">✨</div>
            </div>
          </div>
        </div>

        <!-- Final message -->
        <div class="final-message" #finalMessage>
          <h1 class="final-title">I miss you dear</h1>
          <p class="final-subtitle">
            Until we meet again, you're always in my heart
          </p>
          <div class="message-signature">– Forever yours</div>
        </div>

        <!-- Floating elements -->
        <div class="floating-elements">
          <div
            class="floating-element heart-float"
            style="left: 10%; top: 20%; animation-delay: 0s;"
          >
            💕
          </div>
          <div
            class="floating-element heart-float"
            style="left: 85%; top: 15%; animation-delay: 1s;"
          >
            💖
          </div>
          <div
            class="floating-element heart-float"
            style="left: 15%; top: 80%; animation-delay: 2s;"
          >
            💗
          </div>
          <div
            class="floating-element heart-float"
            style="left: 90%; top: 75%; animation-delay: 1.5s;"
          >
            💝
          </div>
          <div
            class="floating-element petal-float"
            style="left: 25%; top: 10%; animation-delay: 0.5s;"
          >
            🌸
          </div>
          <div
            class="floating-element petal-float"
            style="left: 70%; top: 85%; animation-delay: 2.5s;"
          >
            🌺
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./finale-section.component.scss'],
})
export class FinaleSectionComponent implements OnInit {
  @ViewChild('finaleSection') finaleSection!: ElementRef;
  @ViewChild('flyingHeart') flyingHeart!: ElementRef;
  @ViewChild('finalMessage') finalMessage!: ElementRef;
  @ViewChild('sparkleTrail') sparkleTrail!: ElementRef;
  @ViewChild('starsContainer') starsContainer!: ElementRef;

  private isBrowser: boolean;

  stars = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  sparkles = Array.from({ length: 8 }, () => ({}));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
      setTimeout(() => this.initFinaleAnimations(), 200);
    }
  }

  private initFinaleAnimations() {
    if (
      !this.isBrowser ||
      !this.flyingHeart?.nativeElement ||
      !this.finalMessage?.nativeElement
    )
      return;

    // Set initial states
    gsap.set(this.flyingHeart.nativeElement, { x: -200, y: 100, scale: 0.5 });
    gsap.set(this.finalMessage.nativeElement, { opacity: 0, y: 50 });

    const floatingElements = document.querySelectorAll('.floating-element');
    if (floatingElements.length > 0) {
      gsap.set(floatingElements, { opacity: 0, scale: 0 });
    }

    // Create timeline for scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.finaleSection.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    // Flying heart animation
    tl.to(this.flyingHeart.nativeElement, {
      duration: 3,
      x: 0,
      y: -50,
      scale: 1,
      ease: 'power2.out',
      onComplete: () => this.startContinuousHeartAnimation(),
    })
      .to(
        '.wing',
        {
          duration: 0.5,
          rotation: (i) => (i === 0 ? -15 : 15),
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          stagger: 0.1,
        },
        '-=2'
      )
      .to(
        this.finalMessage.nativeElement,
        {
          duration: 1.5,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
        },
        '-=1'
      );

    // Add floating elements animation if they exist
    if (floatingElements.length > 0) {
      tl.to(
        floatingElements,
        {
          duration: 1,
          opacity: 0.8,
          scale: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        },
        '-=1'
      );
    }

    // Sparkle trail animation
    this.animateSparkleTrail();

    // Heart glow animation
    gsap.to('.heart-glow', {
      duration: 2,
      scale: 1.2,
      opacity: 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
  }

  private startContinuousHeartAnimation() {
    if (!this.isBrowser || !this.flyingHeart?.nativeElement) return;

    // Gentle floating animation
    gsap.to(this.flyingHeart.nativeElement, {
      duration: 4,
      y: '+=20',
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });

    gsap.to(this.flyingHeart.nativeElement, {
      duration: 6,
      x: '+=15',
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
  }

  private animateSparkleTrail() {
    if (!this.isBrowser || !this.sparkleTrail?.nativeElement) return;

    const sparkles = this.sparkleTrail.nativeElement.children;

    Array.from(sparkles).forEach((sparkle: any, index) => {
      gsap.set(sparkle, {
        x: -index * 15,
        y: index * 8,
        scale: 0.5 + index * 0.1,
        opacity: 0.8 - index * 0.1,
      });

      gsap.to(sparkle, {
        duration: 1 + Math.random(),
        rotation: 360,
        repeat: -1,
        ease: 'none',
      });

      gsap.to(sparkle, {
        duration: 2 + Math.random(),
        opacity: 0.3 + Math.random() * 0.5,
        scale: '+=0.2',
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: index * 0.1,
      });
    });
  }
}
