import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { MazeSectionComponent } from './components/maze-section/maze-section.component';
import { PortraitsSectionComponent } from './components/portraits-section/portraits-section.component';
import { PolaroidWallComponent } from './components/polaroid-wall/polaroid-wall.component';
import { AlbumFlipSectionComponent } from './components/album-flip-section/album-flip-section.component';
import { FinaleSectionComponent } from './components/finale-section/finale-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroSectionComponent,
    MazeSectionComponent,
    PortraitsSectionComponent,
    PolaroidWallComponent,
    AlbumFlipSectionComponent,
    FinaleSectionComponent
  ],
  template: `
    <main>
      <app-hero-section></app-hero-section>
      <app-maze-section></app-maze-section>
      <app-portraits-section></app-portraits-section>
      <app-polaroid-wall></app-polaroid-wall>
      <app-album-flip-section></app-album-flip-section>
      <app-finale-section></app-finale-section>
    </main>
  `,
  styles: [`
    main {
      position: relative;
    }
  `]
})
export class AppComponent {
  title = 'chandralekha-microsite';
}