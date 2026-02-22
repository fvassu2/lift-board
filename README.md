# lift-board

Forklift Control Panel - Angular 17+ application for RFID warehouse mapping system.

## Features

### ForkliftAnimationComponent
A standalone Angular component that displays real-time forklift status with animated SVG graphics.

**Input Properties:**
- `state`: 'idle' | 'moving' | 'lifting' | 'lowering' | 'error'
- `batteryLevel`: number (0-100)
- `loadWeight`: number (kg)
- `forkHeight`: number (0-100, percentage)

**Animations:**
- **Idle**: Breathing animation effect
- **Moving**: Spinning wheels with vibration
- **Lifting**: Forks rising animation
- **Lowering**: Forks descending animation
- **Error**: Red/orange flashing alert

**Visual Indicators:**
- Color-coded battery indicator (green >50%, yellow 20-50%, red <20%)
- Load weight display on forks when carrying cargo
- Fork height visualization
- State label

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory.

### Running Tests
```bash
npm test
```
Executes the unit tests via [Karma](https://karma-runner.github.io).

## Technology Stack
- Angular 17+ with standalone components
- TypeScript 5.2
- SCSS for styling
- SVG for graphics
- CSS animations (no external libraries)
- Jasmine & Karma for testing

## Project Structure
```
src/
├── app/
│   ├── components/
│   │   └── forklift-animation/
│   │       ├── forklift-animation.component.ts
│   │       ├── forklift-animation.component.html
│   │       ├── forklift-animation.component.scss
│   │       └── forklift-animation.component.spec.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.config.ts
├── index.html
├── main.ts
└── styles.scss
```

## Usage Example

```typescript
import { ForkliftAnimationComponent } from './components/forklift-animation/forklift-animation.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ForkliftAnimationComponent],
  template: `
    <app-forklift-animation
      [state]="'moving'"
      [batteryLevel]="85"
      [loadWeight]="500"
      [forkHeight]="60">
    </app-forklift-animation>
  `
})
export class DemoComponent { }
```

## License
ISC
