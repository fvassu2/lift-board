# 3D Model Configuration

This directory contains 3D models for warehouse vehicles and the configuration file that controls how they are loaded and transformed.

## Configuration File

**File**: `vehicles-config.json`

This JSON file defines all vehicle types, their 3D model filenames, and transformation properties (rotation and translation).

### Configuration Structure

```json
{
  "id": "forklift-1",
  "name": "Forklift",
  "type": "forklift",
  "maxCapacity": 2000,
  "icon": "🚜",
  "modelConfig": {
    "filename": "forklift.glb",
    "rotation": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "translation": {
      "x": 0,
      "y": 0,
      "z": 0
    }
  }
}
```

## Model Files

Place your GLTF/GLB model files in this directory with the filenames specified in `vehicles-config.json`.

**Example files**:
- `forklift.glb`
- `pallet-jack.glb`
- `stacker.glb`
- `container.glb` (optional, for containers)

## Rotation Configuration

Rotation values are in **degrees** and are applied around each axis:

- **X-axis (rotX)**: Pitch (up/down tilt)
- **Y-axis (rotY)**: Yaw (left/right turn) - Example: `-90` rotates 90° to the right
- **Z-axis (rotZ)**: Roll (sideways tilt)

### Common Rotation Fixes

| Issue | Solution |
|-------|----------|
| Model faces left | `"y": 90` |
| Model faces right | `"y": -90` |
| Model faces backward | `"y": 180` |

## Translation Configuration

Translation values are in **Three.js units** and move the model along each axis:

- **X-axis (transX)**: Left/Right (Positive = right, Negative = left)
- **Y-axis (transY)**: Up/Down (Positive = up, Negative = down)
- **Z-axis (transZ)**: Forward/Backward (Positive = forward, Negative = backward)

### Use Case: Off-Center Rotation Fix

If a model rotates around an incorrect pivot point, use translation to adjust:

```json
{
  "filename": "pallet-jack.glb",
  "rotation": { "x": 0, "y": -90, "z": 0 },
  "translation": { "x": 0.5, "y": 0, "z": 0 }
}
```

## Persistence During Animation

All rotation and translation values are **preserved throughout animation**:
- On load: Base transformations applied
- During animation: Base transformations combined with animation
- On reset: Model returns with base transformations applied

## Model Requirements

- **Format**: GLTF (.gltf) or GLB (.glb)
- **Size**: Under 10MB recommended
- **Scale**: Auto-scaled to ~3 units height
- **Textures**: Embedded in GLB (recommended)
- **Origin**: Centered at origin with base at Y=0
- **Coordinate System**: Forward = -Z, Up = +Y, Right = +X

## Adding a New Vehicle

1. Add model file to this directory
2. Edit `vehicles-config.json` and add new entry
3. Restart dev server (`npm start`)
4. Test and adjust rotation/translation as needed

## Model Sources

- [Sketchfab](https://sketchfab.com/)
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)
- [Free3D](https://free3d.com/)

## See Also

- `ROTATION_GUIDE.md` - Detailed coordinate system information
- `README.md` (project root) - Overall project documentation
