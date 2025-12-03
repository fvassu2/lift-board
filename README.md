# Lift Board - Warehouse Tablet Dashboard

A modern Angular 19 application providing a tablet-optimized dashboard for warehouse forklift operators. Features real-time 3D vehicle visualization, mission management, and RFID container validation.

![Lift Board Dashboard](https://github.com/user-attachments/assets/b50c73c4-4125-4fe0-8aab-ef4aaee74313)

## 🚀 Features

### 3D Vehicle Visualization
- **Three.js-powered 3D rendering** with real-time vehicle models
- **Three vehicle types**: Forklift, Pallet Jack, and Stacker
- **Multiple camera views**: Orbital, Top-down, First-person, and Side views
- **Dynamic container rendering** - visualize stackable containers on vehicles
- **Smooth animations** and interactive controls

### Mission Management
- **Mission control panel** with target location and container count
- **Live mission status** tracking (Pending, In-Progress, Completed, Error)
- **Container ID management** with auto-generation
- **Start/Complete/Cancel** mission controls

### RFID Validation System
- **Real-time scan feedback** with visual alerts
- **✅ Green indicators** for valid scans (correct container + correct location)
- **❌ Red indicators** for invalid scans (wrong container or wrong location)
- **Scan history** showing recent validation attempts
- **Mock RFID service** for testing and demonstration

### Tablet-Optimized UI
- **Responsive layout** optimized for 1024x768 tablets (landscape)
- **Touch-friendly controls** with minimum 44x44px touch targets
- **High contrast design** for warehouse environments
- **Clean, modern interface** with Material Design principles

## 📸 Screenshots

### Initial View
![Initial View](https://github.com/user-attachments/assets/a8bab6ff-9081-406b-acc9-434f7e4b02c0)

### Mission in Progress with Containers
![Mission Started](https://github.com/user-attachments/assets/f618487f-f964-4a76-8442-1899949203de)

### Valid RFID Scan
![Valid Scan](https://github.com/user-attachments/assets/637e6722-11bb-4c00-bd33-893698bf5e41)

### Invalid RFID Scan
![Invalid Scan](https://github.com/user-attachments/assets/56b1991c-6cec-4b77-8b0f-352140922245)

## 🛠️ Technology Stack

- **Angular 19** - Latest version with standalone components
- **Three.js** - 3D graphics rendering
- **TypeScript** - Type-safe development with strict mode
- **RxJS** - Reactive programming for real-time updates
- **CSS3** - Modern styling with flexbox and grid layouts

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup

1. Clone the repository:
```bash
git clone https://github.com/fvassu2/lift-board.git
cd lift-board
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## 🏗️ Project Structure

```
lift-board/
├── src/
│   ├── lib/                          # Library code (publishable)
│   │   ├── components/               # UI components
│   │   │   ├── vehicle-selector/    # Vehicle selection component
│   │   │   ├── scene-3d/            # Three.js 3D scene component
│   │   │   ├── mission-panel/       # Mission control component
│   │   │   └── rfid-validator/      # RFID validation component
│   │   ├── services/                # Business logic services
│   │   │   ├── vehicle.service.ts   # Vehicle management
│   │   │   ├── three-scene.service.ts # 3D scene management
│   │   │   └── rfid-mock.service.ts # Mock RFID scanning
│   │   └── models/                  # TypeScript interfaces
│   │       ├── vehicle.model.ts
│   │       ├── mission.model.ts
│   │       └── rfid-scan-result.model.ts
│   └── app/                         # Demo application
│       ├── app.component.ts         # Main app component
│       ├── app.component.html       # App template
│       └── app.component.css        # App styles
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies and scripts
└── tsconfig.json                    # TypeScript configuration
```

## 🎮 Usage

### Selecting a Vehicle

1. Click on one of the three vehicle cards in the left sidebar:
   - 🚜 **Forklift** - Capacity: 2000kg
   - 🛒 **Pallet Jack** - Capacity: 1000kg
   - 📦 **Stacker** - Capacity: 1500kg

2. The selected vehicle will appear in the 3D scene with a blue highlight

### Starting a Mission

1. Enter a **target location** (e.g., "A-5-3")
2. Set the **container count** (1-10)
3. Click **Start Mission**
4. The system will:
   - Generate container IDs (CONT-001, CONT-002, etc.)
   - Display containers in the 3D scene
   - Set mission status to "IN-PROGRESS"

### Scanning Containers (RFID Validation)

Two simulation options are available:

1. **Simulate Scan** - Random validation result
   - May succeed or fail based on random container ID and location
   
2. **Simulate Success** - Guaranteed valid scan
   - Always uses correct container ID and location

**Valid Scan** shows:
- ✅ Green background
- "VALID SCAN" message
- Container ID, expected location, and scanned location (matching)

**Invalid Scan** shows:
- ❌ Red background
- "INVALID SCAN" message
- Container ID and location mismatch details

### Changing Camera Views

Use the camera control buttons in the 3D scene:
- **Orbital** - Default rotating view around the vehicle
- **Top-down** - Bird's eye view from directly above
- **First-person** - View from behind the vehicle
- **Side** - View from the side

### Completing a Mission

1. Click **Complete** to mark the mission as finished
2. Click **Cancel** to abort the mission
3. The system resets and is ready for the next mission

## 🔧 Building for Production

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Code Structure

The application follows Angular best practices:
- **Standalone components** - No NgModules required
- **Signals** for reactive state management
- **Dependency injection** for services
- **TypeScript strict mode** enabled
- **Component-scoped styles** using ViewEncapsulation

## 📚 API Reference

### VehicleService

Manages vehicle selection and state.

```typescript
getVehicles(): Vehicle[]                    // Get all available vehicles
getSelectedVehicle(): Signal<Vehicle|null>  // Get selected vehicle signal
selectVehicle(vehicleId: string): void      // Select a vehicle by ID
clearSelection(): void                      // Clear vehicle selection
```

### ThreeSceneService

Manages the Three.js 3D scene.

```typescript
initScene(canvas: HTMLCanvasElement, width: number, height: number): void
createVehicle(vehicle: Vehicle): void       // Create 3D vehicle model
addContainers(count: number): void          // Add containers to scene
setCameraView(view: CameraView): void       // Change camera perspective
getCurrentView(): CameraView                // Get current camera view
onResize(width: number, height: number): void
dispose(): void                             // Cleanup resources
```

### RfidMockService

Mock RFID scanning service for testing.

```typescript
get scans$: Observable<RfidScanResult>      // Observable of scan results
setCurrentMission(mission: Mission): void   // Set active mission
scanContainer(containerId: string, location: string): void
simulateScan(forceSuccess?: boolean): void  // Simulate a scan
generateContainerIds(count: number): string[]
```

## 🎨 Customization

### Colors

The application uses a consistent color scheme defined in the components:

- **Success**: `#4caf50` (Green)
- **Error**: `#f44336` (Red)
- **Warning**: `#ff9800` (Orange)
- **Primary**: `#2196f3` (Blue)
- **Neutral**: `#9e9e9e` (Gray)

### Layout

The tablet layout is optimized for 1024x768 landscape orientation:
- **Left sidebar**: 25% width - Vehicle selector + Mission panel
- **Center**: 50% width - 3D scene
- **Right sidebar**: 20% width - RFID validator

Responsive breakpoints are defined for smaller tablets in `app.component.css`.

## 🚧 Future Enhancements

### Phase 2
- [ ] Warehouse floor plan visualization (import from JSON)
- [ ] Real RFID hardware integration
- [ ] Path planning and navigation algorithms
- [ ] Custom container dimensions and types
- [ ] Multi-mission queue management
- [ ] Operator authentication and profiles

### Phase 3
- [ ] Realistic 3D models (GLTF/GLB import)
- [ ] Physics simulation for container handling
- [ ] Collision detection
- [ ] Performance analytics and reporting
- [ ] Offline mode with sync capability
- [ ] Multi-language support (i18n)
- [ ] Voice commands integration

### Phase 4
- [ ] Integration with warehouse management systems (WMS)
- [ ] Real-time location tracking with beacons
- [ ] AR (Augmented Reality) mode for on-device cameras
- [ ] Battery and maintenance alerts
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Three.js bundle size increases the initial load (821 KB). Consider lazy loading for production.
- Vehicle rotation in orbital view may need performance optimization for low-end tablets.
- RFID mock service is for testing only - real hardware integration required for production use.

## 📞 Support

For questions and support, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Three.js community for 3D graphics capabilities
- Contributors and testers

---

**Built with ❤️ for warehouse operators**
