import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { HER_NAME, NICKNAMES, MAIN_MESSAGE } from '../../shared/constants';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section section" #heroSection>
      <!-- Heart Nebula Background -->
      <div class="nebula-bg">
        <svg
          class="nebula-svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="heartGradient1" cx="30%" cy="40%">
              <stop offset="0%" stop-color="var(--rose)" stop-opacity="0.8" />
              <stop offset="50%" stop-color="var(--blush)" stop-opacity="0.4" />
              <stop
                offset="100%"
                stop-color="var(--rose-gold)"
                stop-opacity="0.1"
              />
            </radialGradient>
            <radialGradient id="heartGradient2" cx="70%" cy="60%">
              <stop offset="0%" stop-color="var(--blush)" stop-opacity="0.6" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
          </defs>
          <path
            class="heart-blob-1"
            d="M300,200 Q200,100 400,150 Q600,100 500,200 Q450,300 400,400 Q350,300 300,200"
            fill="url(#heartGradient1)"
          />
          <path
            class="heart-blob-2"
            d="M800,300 Q700,200 900,250 Q1100,200 1000,300 Q950,400 900,500 Q850,400 800,300"
            fill="url(#heartGradient2)"
          />
          <circle
            class="floating-heart"
            cx="200"
            cy="600"
            r="3"
            fill="var(--rose)"
            opacity="0.6"
          />
          <circle
            class="floating-heart"
            cx="1000"
            cy="150"
            r="2"
            fill="var(--blush)"
            opacity="0.8"
          />
          <circle
            class="floating-heart"
            cx="150"
            cy="100"
            r="2.5"
            fill="var(--rose-gold)"
            opacity="0.7"
          />
        </svg>
      </div>

      <!-- Particles Container -->
      <div class="particles-container" #particlesContainer></div>

      <!-- Content -->
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="main-name" #mainName>{{ herName }}</span>
          <span class="heart-icon">❤️</span>
        </h1>
        <div class="nickname-cycling" #nicknameCycling>
          <span
            class="nickname"
            *ngFor="let nickname of nicknames; let i = index"
            [class.active]="currentNicknameIndex() === i"
          >
            {{ nickname }}
          </span>
        </div>
        <p class="hero-subtitle" #heroSubtitle>{{ mainMessage }}</p>

        <!-- Moon (clickable easter egg) -->
        <div class="moon" #moon (click)="toggleNickname()">
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="var(--blush)" opacity="0.8" />
            <circle
              cx="40"
              cy="40"
              r="3"
              fill="var(--rose-gold)"
              opacity="0.6"
            />
            <circle
              cx="60"
              cy="35"
              r="2"
              fill="var(--rose-gold)"
              opacity="0.4"
            />
            <circle
              cx="35"
              cy="65"
              r="4"
              fill="var(--rose-gold)"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('mainName') mainName!: ElementRef;
  @ViewChild('nicknameCycling') nicknameCycling!: ElementRef;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
  @ViewChild('moon') moon!: ElementRef;
  @ViewChild('particlesContainer') particlesContainer!: ElementRef;

  herName = HER_NAME;
  nicknames = NICKNAMES;
  mainMessage = MAIN_MESSAGE;
  currentNicknameIndex = signal(0);

  private timeline?: gsap.core.Timeline;
  private particleTimeline?: gsap.core.Timeline;
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => this.initAnimations(), 200);
      this.startNicknameCycling();
      setTimeout(() => this.initParticles(), 300);
      setTimeout(() => this.setupMouseInteraction(), 400);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      if (this.timeline) this.timeline.kill();
      if (this.particleTimeline) this.particleTimeline.kill();
      if (this.mouseMoveHandler) {
        window.removeEventListener('mousemove', this.mouseMoveHandler);
      }
    }
  }

  private initAnimations() {
    if (!this.isBrowser || !this.mainName?.nativeElement) return;

    this.timeline = gsap.timeline();

    // Set initial states
    gsap.set(
      [
        this.mainName.nativeElement,
        this.nicknameCycling.nativeElement,
        this.heroSubtitle.nativeElement,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.set('.heart-blob-1, .heart-blob-2', { scale: 0.8, opacity: 0 });
    gsap.set('.floating-heart', { scale: 0 });

    // Main animation sequence
    this.timeline
      .to('.heart-blob-1', {
        duration: 2,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
      })
      .to(
        '.heart-blob-2',
        { duration: 2, scale: 1, opacity: 1, ease: 'power2.out' },
        '-=1.5'
      )
      .to(
        '.floating-heart',
        { duration: 1, scale: 1, stagger: 0.2, ease: 'back.out(1.7)' },
        '-=1'
      )
      .to(this.mainName.nativeElement, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      })
      .to(
        this.nicknameCycling.nativeElement,
        { duration: 0.8, opacity: 1, y: 0, ease: 'power2.out' },
        '-=0.5'
      )
      .to(
        this.heroSubtitle.nativeElement,
        { duration: 0.8, opacity: 1, y: 0, ease: 'power2.out' },
        '-=0.3'
      );

    // Continuous heart blob animation
    gsap.to('.heart-blob-1', {
      duration: 4,
      rotation: 360,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center',
    });

    gsap.to('.heart-blob-2', {
      duration: 6,
      rotation: -360,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center',
    });
  }

  private startNicknameCycling() {
    if (!this.isBrowser) return;

    setInterval(() => {
      this.currentNicknameIndex.set(
        (this.currentNicknameIndex() + 1) % this.nicknames.length
      );
    }, 3000);
  }

  private initParticles() {
    if (!this.isBrowser || !this.particlesContainer?.nativeElement) return;

    const container = this.particlesContainer.nativeElement;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.innerHTML = '💕';
      particle.style.cssText = `
        position: absolute;
        pointer-events: none;
        opacity: 0;
        font-size: ${Math.random() * 10 + 8}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      container.appendChild(particle);
    }
  }

  private setupMouseInteraction() {
    if (!this.isBrowser || !this.particlesContainer?.nativeElement) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const particles = this.particlesContainer.nativeElement.children;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      Array.from(particles).forEach((particle: any, index) => {
        const delay = index * 0.1;

        gsap.to(particle, {
          duration: 0.5,
          x: (mouseX - window.innerWidth / 2) * (0.1 + index * 0.02),
          y: (mouseY - window.innerHeight / 2) * (0.1 + index * 0.02),
          opacity: 0.6,
          delay: delay,
          ease: 'power2.out',
        });
      });
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  toggleNickname() {
    if (!this.isBrowser) return;

    this.currentNicknameIndex.set(
      (this.currentNicknameIndex() + 1) % this.nicknames.length
    );

    // Moon pulse animation
    if (this.moon?.nativeElement) {
      gsap.to(this.moon.nativeElement, {
        duration: 0.3,
        scale: 1.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
  }
}
