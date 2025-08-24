# Chandralekha Romantic Microsite

A beautiful, romantic single-page Angular application with rich animations and mature UI design.

## Features

- **Hero Section**: Parallax background with typing animation and nickname cycling
- **Maze of Secrets**: Interactive mouse-trail maze that reveals hidden words
- **Batman & Catwoman Portraits**: Noir-style silhouettes with hover embrace animation
- **Polaroid Wall**: Draggable polaroid cards with flip animations
- **Album Flip**: Scroll-driven page flipping with love quotes
- **Grand Finale**: Flying heart with wings and sparkle effects

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Server**:
   ```bash
   ng serve
   ```

3. **Build for Production**:
   ```bash
   ng build --prod
   ```

## Customization

### Colors & Theme
Edit CSS variables in `src/styles.scss`:
```scss
:root {
  --rose: #ff6b9d;
  --blush: #ffb3d1;
  --rose-gold: #e8b4cb;
  --ink: #2d1b3d;
  --midnight-purple: #4a2c5a;
}
```

### Names & Messages
Update constants in `src/app/shared/constants.ts`:
```typescript
export const HER_NAME = 'Chandralekha';
export const NICKNAMES = ['pattu', 'thangam', 'chellam', 'chandra kutty'];
export const MAIN_MESSAGE = "I'll miss you and I want to meet you definitely one day.";
```

### Love Quotes
Add or modify quotes in the `LOVE_QUOTES` array in `constants.ts`.

### Polaroid Cards
Edit the `polaroidCards` array in `polaroid-wall.component.ts` to add more memories.

## Accessibility Features

- Full keyboard navigation support
- `prefers-reduced-motion` respect for accessibility
- Proper ARIA labels and semantic markup
- High contrast color ratios
- Screen reader friendly content

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile responsive design
- Touch and mouse interaction support

## Performance

- Optimized animations for 60fps
- Lazy loading for heavy assets
- Efficient GSAP usage with cleanup
- Compressed SVG assets
- No external API dependencies

## Easter Eggs

- Click the moon in the hero section to cycle nicknames
- Draw a heart shape with your mouse in the maze section
- Hover over the portraits to see them embrace
- Scroll wheel in the album section to flip pages
- Haptic feedback on supported devices

## Technical Stack

- **Angular 17+** with standalone components
- **GSAP** for advanced animations
- **TypeScript** with strict mode
- **SCSS** with CSS custom properties
- **Responsive design** with mobile-first approach
- **No external dependencies** beyond core libraries

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── hero-section/
│   │   ├── maze-section/
│   │   ├── portraits-section/
│   │   ├── polaroid-wall/
│   │   ├── album-flip-section/
│   │   └── finale-section/
│   ├── shared/
│   │   └── constants.ts
│   └── app.component.ts
├── assets/
└── styles.scss
```

## License

Personal use only. Created with love for Chandralekha. 💕

---

*"Every mile between us is a petal waiting to fall."*