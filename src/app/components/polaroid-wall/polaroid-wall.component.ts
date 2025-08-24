import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

interface PolaroidCard {
  id: number;
  caption: string;
  quote: string;
  rotation: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-polaroid-wall',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="polaroid-section section" #polaroidSection>
      <div class="polaroid-container">
        <h2 class="section-title">Memories & Dreams</h2>
        <p class="section-subtitle">Drag the polaroids to explore...</p>

        <div class="polaroid-wall" #polaroidWall>
          <div
            class="polaroid-card"
            *ngFor="let card of polaroidCards; trackBy: trackByCardId"
            [attr.data-id]="card.id"
            [style.transform]="
              'translate(' +
              card.x +
              'px, ' +
              card.y +
              'px) rotate(' +
              card.rotation +
              'deg)'
            "
            (click)="flipCard(card)"
            #polaroidCard
          >
            <div
              class="polaroid-inner"
              [class.flipped]="flippedCards.has(card.id)"
            >
              <!-- Front side -->
              <div class="polaroid-front">
                <div class="tape tape-top"></div>
                <div class="polaroid-image">
                  <!-- Heart doodle as placeholder -->
                  <svg viewBox="0 0 100 80" class="placeholder-image">
                    <defs>
                      <pattern
                        id="noise"
                        x="0"
                        y="0"
                        width="4"
                        height="4"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="1" cy="1" r="0.5" fill="rgba(0,0,0,0.1)" />
                        <circle
                          cx="3"
                          cy="3"
                          r="0.3"
                          fill="rgba(255,255,255,0.1)"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100"
                      height="80"
                      fill="var(--soft-white)"
                      opacity="0.9"
                    />
                    <rect width="100" height="80" fill="url(#noise)" />
                    <!-- Heart sketch -->
                    <path
                      d="M30,35 C25,25 15,25 15,35 C15,25 5,25 10,35 C15,50 30,60 30,60 C30,60 45,50 50,35 C55,25 45,25 45,35 C45,25 35,25 30,35"
                      stroke="var(--rose)"
                      stroke-width="1.5"
                      fill="none"
                      opacity="0.6"
                    />
                    <!-- Small hearts -->
                    <circle
                      cx="60"
                      cy="25"
                      r="2"
                      fill="var(--blush)"
                      opacity="0.5"
                    />
                    <circle
                      cx="70"
                      cy="45"
                      r="1.5"
                      fill="var(--rose)"
                      opacity="0.4"
                    />
                    <circle
                      cx="20"
                      cy="60"
                      r="1"
                      fill="var(--rose-gold)"
                      opacity="0.6"
                    />
                  </svg>
                </div>
                <div class="polaroid-caption">{{ card.caption }}</div>
                <div class="tape tape-bottom"></div>
              </div>

              <!-- Back side -->
              <div class="polaroid-back">
                <div class="quote-text">"{{ card.quote }}"</div>
                <div class="signature">– with love</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./polaroid-wall.component.scss'],
})
export class PolaroidWallComponent implements OnInit, AfterViewInit {
  @ViewChild('polaroidSection') polaroidSection!: ElementRef;
  @ViewChild('polaroidWall') polaroidWall!: ElementRef;

  flippedCards = new Set<number>();
  private isBrowser: boolean;

  polaroidCards: PolaroidCard[] = [
    {
      id: 1,
      caption: 'miss you',
      quote: 'Distance means nothing when someone means everything',
      rotation: -5,
      x: -150,
      y: -50,
    },
    {
      id: 2,
      caption: 'thinking of you',
      quote: 'Every sunset reminds me of your smile',
      rotation: 8,
      x: 100,
      y: -80,
    },
    {
      id: 3,
      caption: 'for you, Chandralekha',
      quote: "Until we meet again, you're in my heart",
      rotation: -12,
      x: -50,
      y: 70,
    },
    {
      id: 4,
      caption: 'always',
      quote: 'Some bonds transcend time and space',
      rotation: 6,
      x: 180,
      y: 40,
    },
    {
      id: 5,
      caption: 'our story',
      quote: 'The best chapters are yet to be written',
      rotation: -8,
      x: -200,
      y: 120,
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Register Draggable plugin
      gsap.registerPlugin(Draggable);
      setTimeout(() => this.initSwayAnimation(), 200);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => this.initDragInteraction(), 400);
    }
  }

  trackByCardId(index: number, card: PolaroidCard): number {
    return card.id;
  }

  flipCard(card: PolaroidCard) {
    if (!this.isBrowser) return;

    if (this.flippedCards.has(card.id)) {
      this.flippedCards.delete(card.id);
    } else {
      this.flippedCards.add(card.id);
    }

    // Add a subtle bounce animation
    if (this.polaroidWall?.nativeElement) {
      const cardElement = this.polaroidWall.nativeElement.querySelector(
        `[data-id="${card.id}"]`
      );
      if (cardElement) {
        gsap.to(cardElement, {
          duration: 0.1,
          scale: 0.95,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      }
    }
  }

  private initSwayAnimation() {
    if (!this.isBrowser || !this.polaroidWall?.nativeElement) return;

    const cards =
      this.polaroidWall.nativeElement.querySelectorAll('.polaroid-card');

    cards.forEach((card: Element, index: number) => {
      gsap.to(card, {
        duration: 3 + Math.random() * 2,
        rotation: `+=${Math.random() * 4 - 2}`,
        y: `+=${Math.random() * 10 - 5}`,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: index * 0.2,
      });
    });
  }

  private initDragInteraction() {
    if (!this.isBrowser || !this.polaroidWall?.nativeElement) return;

    const cards =
      this.polaroidWall.nativeElement.querySelectorAll('.polaroid-card');

    cards.forEach((card: Element) => {
      Draggable.create(card, {
        type: 'x,y',
        bounds: this.polaroidWall.nativeElement,
        inertia: true,
        edgeResistance: 0.8,
        onDragStart: function (this: any) {
          gsap.to(this['target'], {
            duration: 0.2,
            scale: 1.1,
            rotation: Math.random() * 10 - 5,
            zIndex: 100,
            ease: 'power2.out',
          });
        },
        onDragEnd: function (this: any) {
          gsap.to(this['target'], {
            duration: 0.3,
            scale: 1,
            zIndex: 'auto',
            ease: 'power2.out',
          });
        },
      });
    });
  }
}