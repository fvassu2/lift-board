# ForkliftKawaiiComponent

A cute, kawaii-style Angular standalone component that displays an animated forklift with expressive facial features and state-based animations.

## Features

### 🎨 Kawaii Design
- Big expressive eyes that change based on state
- Pink blush cheeks (always visible)
- Pastel colors (yellow cabin, pink body)
- Soft, rounded shapes
- Google Doodle / Sanrio inspired

### 🎭 States & Expressions

#### Idle State
- Normal round eyes
- Gentle smile
- Blinking animation (every 3-5 seconds)
- Breathing animation (gentle scale)

#### Moving State
- Determined expression
- Energetic smile
- Sweat drops
- Dust cloud animation
- Rotating wheels
- Bouncing motion

#### Loading State
- Concentrated eyes (half-closed)
- Tongue out for concentration
- Fork arms moving up and down

#### Unloading State
- Happy crescent eyes
- Big smile
- Sparkles and hearts
- Fork arms moving

#### Error State
- X eyes
- Worried frown
- Large sweat drop
- Shaking animation

#### Low Battery (< 20%)
- Tired eyes (half-closed)
- Slower animations
- Red battery indicator

### 📊 Battery Indicator
- **Green** (≥60%): Healthy battery
- **Yellow** (30-59%): Medium battery
- **Red** (<30%): Low battery

## Installation

The component is already part of this Angular project. Simply import it where needed:

```typescript
import { ForkliftKawaiiComponent } from './components/forklift-kawaii/forklift-kawaii.component';
```

## Usage

### Basic Example
```html
<app-forklift-kawaii
  [state]="'idle'"
  [direction]="'right'"
  [batteryLevel]="100">
</app-forklift-kawaii>
```

### With Mission Info
```html
<app-forklift-kawaii
  [state]="'moving'"
  [direction]="'right'"
  [batteryLevel]="75"
  [currentMission]="'Prelievo scaffale A-12'"
  [operatorName]="'Mario Rossi'">
</app-forklift-kawaii>
```

## Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `state` | `'idle' \| 'moving' \| 'loading' \| 'unloading' \| 'error'` | `'idle'` | Current state of the forklift |
| `direction` | `'left' \| 'right'` | `'right'` | Direction the forklift is facing |
| `batteryLevel` | `number` | `100` | Battery level (0-100) |
| `currentMission` | `string \| undefined` | `undefined` | Optional mission description |
| `operatorName` | `string \| undefined` | `undefined` | Optional operator name |

## Technical Details

### Technologies
- **Angular 17+** Standalone Component
- **TypeScript** 5.4+
- **SVG** for graphics
- **SCSS** for styling
- **Pure CSS Animations** (no external libraries)

### Responsive Design
The component is responsive and scales properly on different screen sizes:
- Desktop: max-width 300px
- Tablet (≤768px): max-width 250px
- Mobile (≤480px): max-width 200px

### Testing
The component includes comprehensive unit tests (45 tests).

Run tests with:
```bash
npm test
```

## File Structure

```
src/app/components/forklift-kawaii/
├── forklift-kawaii.component.ts      # Component logic
├── forklift-kawaii.component.html    # SVG template
├── forklift-kawaii.component.scss    # Styles & animations
└── forklift-kawaii.component.spec.ts # Unit tests
```

## Development

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Lint
```bash
npm run lint
```

### Serve
```bash
npm start
# Navigate to http://localhost:4200
```

## Design Philosophy

This component is designed to be:
- **Friendly and approachable** - Perfect for gamification or friendly dashboards
- **Distinctive** - Clearly different from industrial/technical forklift components
- **Expressive** - Uses facial expressions to convey state
- **Delightful** - Includes fun animations and kawaii elements

## Inspiration

Design inspired by:
- Google Doodles
- Pusheen character style
- Sanrio aesthetics
