# Lift Board - Operator Dashboard

A comprehensive dashboard application for forklift operators to manage missions, track RFID operations, and visualize real-time forklift movements.

![Operator Dashboard](https://github.com/user-attachments/assets/cd3c5707-615f-4621-8372-fd4b8b45ac99)

## Features

### 🚜 Current Mission Display
- Real-time mission tracking with visual progress indicators
- Article information with photos
- Origin and destination locations
- Color-coded bin status (Completed, Loaded, Pending)
- Interactive action buttons (Start, Complete Bin, Complete Mission, Report Issue)
- Elapsed time tracking

### 🎬 Canvas Animation
- Real-time forklift animation using HTML5 Canvas
- Smooth transitions between locations
- Visual loading/unloading states
- Dynamic positioning based on mission progress
- Animated bin transportation

### 📡 RFID Integration Panel
- **Connection Status**: Real-time RFID reader connection monitoring
- **Message Stream**: Scrollable history of RFID events (Read, Write, Error)
- **Notifications**: Auto-dismissing alerts for important events
- **Heartbeat Tracking**: Reader connectivity monitoring

### 📋 Mission Management
- **Assigned Missions**: Personal mission queue with priorities
- **Public Missions**: Available missions for self-assignment
- **Mission Details**: Article info, route, estimated time, priority
- **Drawer Navigation**: Slide-out panel for easy mission selection

### 🔧 Manual Backup Toolbar
- **Barcode Scanner**: Camera-based fallback for RFID failures
- **Manual Input**: Direct bin code entry with validation
- **Bin Status Controls**: Manual state management for bins
- **RFID Reconnection**: Quick reconnect functionality
- **Operation Counters**: Track manual vs RFID operations

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Canvas Rendering**: react-konva
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fvassu2/lift-board.git
cd lift-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── animation/       # Canvas forklift animation
│   ├── layout/          # Header and layout components
│   ├── mission/         # Mission display and drawer
│   ├── rfid/            # RFID status, stream, and notifications
│   └── toolbar/         # Manual backup toolbar
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── utils/               # Mock data and utilities
```

## Key Components

### State Management (Zustand)

The application uses Zustand for centralized state management:

- **Operator Data**: Current operator information
- **Missions**: Current, assigned, and public missions
- **RFID**: Connection status and message stream
- **Notifications**: Toast notification system
- **Animation**: Forklift animation states
- **UI State**: Drawer visibility, manual mode, operation counters

### Mock Data

The application includes comprehensive mock data for development:
- 5 sample missions with various states
- Article information with Unsplash images
- Location data (yards, cells, production lines)
- Bin tracking with RFID tags

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run build  # TypeScript compilation is part of build
```

## API Integration (Future)

The application is designed to integrate with the following API endpoints:

```
GET  /api/operator/missions/current     - Get current mission
GET  /api/operator/missions/assigned    - Get assigned missions
GET  /api/operator/missions/public      - Get public missions
POST /api/operator/missions/:id/assign  - Self-assign mission
PUT  /api/operator/missions/:id/start   - Start mission
PUT  /api/operator/missions/:id/bins/:binId/complete - Complete bin
PUT  /api/operator/missions/:id/complete - Complete mission
POST /api/operator/missions/:id/issue   - Report issue
WS   /ws/rfid                           - RFID event stream
```

## Design Principles

### Touch-First UI
- Minimum 44x44px touch targets
- Large, accessible buttons
- Optimized for tablet devices in landscape mode

### High Contrast
- Clear visual hierarchy
- Accessible color schemes
- Prominent status indicators

### Real-Time Updates
- WebSocket integration for RFID events
- Automatic state synchronization
- Live progress tracking

### Fallback Support
- Manual input when RFID unavailable
- Barcode scanning alternative
- Operation tracking for audit purposes

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

This project is proprietary software.

## Contributing

Please contact the repository owner for contribution guidelines.
