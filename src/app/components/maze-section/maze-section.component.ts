import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { HIDDEN_WORDS } from '../../shared/constants';

@Component({
  selector: 'app-maze-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="maze-section section" #mazeSection>
      <div class="maze-container">
        <h2 class="section-title">Maze of Secrets</h2>
        <p class="instruction">Move your cursor to reveal hidden words...</p>

        <div class="maze-overlay" #mazeOverlay>
          <svg class="maze-svg" viewBox="0 0 800 600" #mazeSvg>
            <!-- Maze paths -->
            <path
              class="maze-path"
              d="M50,50 L750,50 L750,550 L50,550 Z M100,100 L700,100 L700,500 L100,500 Z"
            />
            <path
              class="maze-path"
              d="M150,150 L350,150 L350,250 L550,250 L550,450 L650,450"
            />
            <path class="maze-path" d="M200,200 L400,200 L400,350 L600,350" />
            <path class="maze-path" d="M250,300 L450,300 L450,400" />

            <!-- Glow trail -->
            <path
              class="glow-trail"
              #glowTrail
              d=""
              stroke="var(--rose)"
              stroke-width="4"
              fill="none"
              opacity="0.8"
            />
          </svg>

          <!-- Hidden words -->
          <div
            class="hidden-word"
            *ngFor="let word of hiddenWords; let i = index"
            [style.left.px]="wordPositions[i].x"
            [style.top.px]="wordPositions[i].y"
            [class.revealed]="revealedWords().includes(word)"
            #hiddenWordEl
          >
            {{ word }}
          </div>
        </div>

        <div class="progress-indicator">
          <span
            >{{ revealedWords().length }} / {{ hiddenWords.length }} secrets
            found</span
          >
          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="
                (revealedWords().length / hiddenWords.length) * 100
              "
            ></div>
          </div>
        </div>

        <div class="unlock-message" *ngIf="allWordsRevealed()" #unlockMessage>
          <h3>✨ All secrets revealed! ✨</h3>
          <p>Scroll down to continue your journey...</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./maze-section.component.scss'],
})
export class MazeSectionComponent implements OnInit, OnDestroy {
  @ViewChild('mazeSection') mazeSection!: ElementRef;
  @ViewChild('mazeOverlay') mazeOverlay!: ElementRef;
  @ViewChild('glowTrail') glowTrail!: ElementRef;
  @ViewChild('unlockMessage') unlockMessage!: ElementRef;

  hiddenWords = HIDDEN_WORDS;
  revealedWords = signal<string[]>([]);
  private isBrowser: boolean;

  wordPositions = [
    { x: 200, y: 180 },
    { x: 450, y: 280 },
    { x: 350, y: 380 },
    { x: 580, y: 330 },
    { x: 250, y: 450 },
  ];

  private mouseMoveHandler?: (e: MouseEvent) => void;
  private trailPoints: { x: number; y: number }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => this.setupMazeInteraction(), 200);
    }
  }

  ngOnDestroy() {
    if (
      this.isBrowser &&
      this.mouseMoveHandler &&
      this.mazeOverlay?.nativeElement
    ) {
      this.mazeOverlay.nativeElement.removeEventListener(
        'mousemove',
        this.mouseMoveHandler
      );
    }
  }

  allWordsRevealed(): boolean {
    return this.revealedWords().length === this.hiddenWords.length;
  }

  private setupMazeInteraction() {
    if (
      !this.isBrowser ||
      !this.mazeOverlay?.nativeElement ||
      !this.glowTrail?.nativeElement
    )
      return;

    const overlay = this.mazeOverlay.nativeElement;
    const trail = this.glowTrail.nativeElement;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = overlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update trail
      this.trailPoints.push({ x, y });
      if (this.trailPoints.length > 20) {
        this.trailPoints.shift();
      }

      this.updateTrail();

      // Check proximity to hidden words
      this.checkWordProximity(x, y);
    };

    overlay.addEventListener('mousemove', this.mouseMoveHandler);
  }

  private updateTrail() {
    if (
      !this.isBrowser ||
      this.trailPoints.length < 2 ||
      !this.glowTrail?.nativeElement
    )
      return;

    const pathData = this.trailPoints.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command}${point.x},${point.y}`;
    }, '');

    this.glowTrail.nativeElement.setAttribute('d', pathData);

    // Fade the trail
    gsap.to(this.glowTrail.nativeElement, {
      duration: 0.5,
      opacity: 0.4,
      ease: 'power2.out',
    });
  }

  private checkWordProximity(mouseX: number, mouseY: number) {
    if (!this.isBrowser) return;

    const threshold = 50;

    this.hiddenWords.forEach((word, index) => {
      if (this.revealedWords().includes(word)) return;

      const wordPos = this.wordPositions[index];
      const distance = Math.sqrt(
        Math.pow(mouseX - wordPos.x, 2) + Math.pow(mouseY - wordPos.y, 2)
      );

      if (distance < threshold) {
        this.revealWord(word);
      }
    });
  }

  private revealWord(word: string) {
    const newRevealed = [...this.revealedWords(), word];
    this.revealedWords.set(newRevealed);

    // Trigger petal confetti if all words revealed
    if (newRevealed.length === this.hiddenWords.length) {
      setTimeout(() => this.triggerConfetti(), 500);
    }
  }

  private triggerConfetti() {
    if (!this.isBrowser || !this.mazeSection?.nativeElement) return;

    // Create petal confetti
    const petals = ['🌸', '🌺', '💐', '🌹', '🌷'];

    for (let i = 0; i < 30; i++) {
      const petal = document.createElement('div');
      petal.className = 'confetti-petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.cssText = `
        position: absolute;
        top: -50px;
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 10 + 15}px;
        pointer-events: none;
        z-index: 100;
      `;

      this.mazeSection.nativeElement.appendChild(petal);

      gsap.to(petal, {
        duration: 3,
        y: window.innerHeight + 100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 360,
        ease: 'power2.out',
        onComplete: () => petal.remove(),
      });
    }

    // Show unlock message
    if (this.unlockMessage?.nativeElement) {
      gsap.fromTo(
        this.unlockMessage.nativeElement,
        { opacity: 0, y: 30 },
        { duration: 1, opacity: 1, y: 0, ease: 'power2.out' }
      );
    }
  }
}
