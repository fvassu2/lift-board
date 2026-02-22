# lift-board

Forklift panel board - An Angular application for forklift management and monitoring.

## Components

### ForkliftKawaiiComponent
A cute, kawaii-style forklift component with expressive animations and facial features. Perfect for friendly dashboards and gamification.

**Features:**
- 5 different states (idle, moving, loading, unloading, error)
- Expressive facial animations
- Battery indicator with color coding
- Pure CSS animations
- SVG-based design
- Fully responsive

[📖 Full Documentation](./docs/FORKLIFT_KAWAII.md)

![ForkliftKawaiiComponent](https://github.com/user-attachments/assets/4f6a5d91-99d3-4c86-aa70-6b83426041a5)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Lint
```bash
npm run lint
```

## Technology Stack
- Angular 17+
- TypeScript 5.4+
- SCSS
- Jasmine/Karma for testing

## Project Structure
```
src/
├── app/
│   ├── components/
│   │   └── forklift-kawaii/    # Kawaii forklift component
│   └── app.component.ts         # Main app component
├── assets/                      # Static assets
├── index.html                   # Entry HTML
└── main.ts                      # Application bootstrap
```

## License
MIT

