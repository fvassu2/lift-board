# 3D Model Rotation & Orientation Guide

This guide explains the coordinate system and expected model orientation for Lift-Board.

## Three.js Coordinate System

**Three.js uses a right-handed coordinate system:**
- **X-axis**: Red (left/right)
- **Y-axis**: Green (up/down)
- **Z-axis**: Blue (forward/back)

**Expected Model Orientation:**
- **Forward direction**: Negative Z-axis (-Z)
- **Up direction**: Positive Y-axis (+Y)
- **Right direction**: Positive X-axis (+X)

### Visual Representation
```
         Y (Up)
         |
         |
         |________ X (Right)
        /
       /
      Z (Back - vehicle front faces -Z)
```

## What This Means for Your Models

When you create or export a model, **the front of the vehicle should face toward negative Z** (-Z direction). This ensures:
- The vehicle moves forward correctly in the animation
- Containers appear in front of the vehicle (not behind or to the side)
- Camera views make sense (first-person looks forward, orbital view is behind)

## Coordinate System Comparison

| Axis | Three.js | Blender | Unity |
|------|----------|---------|-------|
| **Forward** | -Z | -Y | +Z |
| **Up** | +Y | +Z | +Y |
| **Right** | +X | +X | +X |

## Pallet-Jack Special Case

The **pallet-jack model is automatically rotated -90° (Y-axis)** in the application code.

**Why?** Many pallet jack models are oriented sideways, so we correct this automatically.

**Code:**
```typescript
if (vehicle.type === 'pallet-jack') {
  model.rotation.y = -Math.PI / 2; // -90 degrees
}
```

**If your pallet-jack still faces wrong:** Adjust rotation in your 3D software before export.

## How to Fix Model Rotation

### Option 1: Blender (Free & Powerful)

1. **Download Blender**: [blender.org](https://www.blender.org/)

2. **Import your model**:
   - File → Import → (your format: FBX, OBJ, etc.)

3. **Check current orientation**:
   - The front of your vehicle should face **-Y in Blender** (converts to -Z in Three.js)
   - Use the compass in top-right corner to verify axes

4. **Rotate if needed**:
   - **Select the model** (click on it)
   - **Rotate**: Press `R` (rotate), then `Z` (around Z-axis), then `90` (90 degrees)
   - Or use the **Transform panel**: Press `N` key → Rotation → Set angles manually
   - Rotate in 90° increments until vehicle faces -Y

5. **Apply rotation**:
   - Select model → Object → Apply → Rotation (Ctrl+A → Rotation)
   - This bakes the rotation into the model

6. **Export as GLB**:
   - File → Export → glTF 2.0
   - Format: **glTF Binary (.glb)**
   - Check "Apply Modifiers"
   - Export

### Option 2: Online GLTF Editor (Quick Fix)

**glTF Transform** ([gltf-transform.donmccurdy.com](https://gltf-transform.donmccurdy.com/))

1. Upload your GLTF/GLB file
2. Use the Transform tools to rotate
3. Test orientation by viewing the model
4. Download the corrected file

### Option 3: Microsoft 3D Builder (Windows Only, Simple)

1. **Open** Microsoft 3D Builder (pre-installed on Windows 10/11)
2. **Import model**: File → Open
3. **Rotate**: Use rotation handles or Edit → Rotate → Custom angles
4. **Export**: File → Save As → STL or 3MF
5. **Convert to GLTF**: Use online converter like [gltf.report](https://gltf.report/)

## Testing Your Model Orientation

1. **Place model** in `public/assets/models/` with correct filename
2. **Start app**: `npm start`
3. **Select vehicle type**
4. **Check orientation**:
   - Does it face forward in the scene?
   - Start a mission - does it move in the right direction?
   - Are containers positioned in front of the vehicle?

## Common Rotation Fixes

### Model faces backward (180°)
- **Rotate**: 180° around Y-axis
- **Blender**: `R` → `Z` → `180`

### Model faces right (+X direction)
- **Rotate**: -90° around Y-axis
- **Blender**: `R` → `Z` → `-90`

### Model faces left (-X direction)
- **Rotate**: +90° around Y-axis
- **Blender**: `R` → `Z` → `90`

### Model is tilted/on its side
- **Check**: Make sure Y-axis is up
- **Fix**: Rotate around X-axis to level it
- **Blender**: `R` → `X` → `90` (or `-90`)

## Camera Behavior (Vehicle-Relative)

All camera views are **relative to the vehicle orientation**:

- **Orbital**: Behind and above the vehicle
- **First-Person**: Inside cabin, looking forward in travel direction
- **Top-Down**: Directly above (no rotation needed)
- **Side**: To the right side of the vehicle

This means even if your model rotation is slightly off, the camera will still follow the vehicle's actual forward direction.

## Container Positioning

Containers are positioned in **vehicle local space**:
```typescript
// X=0 (centered), Y=0.5 (on forks), Z=1.5 (in front)
container.position.set(0, 0.5 + (index * 1), 1.5);
```

If containers appear behind the vehicle:
- Your model is likely facing backward (rotate 180°)

If containers appear to the side:
- Your model is facing sideways (rotate ±90°)

## Simple 3D Software Recommendations

### For Beginners (Easy):
1. **Microsoft 3D Builder** (Windows) - Pre-installed, very simple
2. **Online viewers** - Just view, no editing ([sandbox.babylonjs.com](https://sandbox.babylonjs.com/))

### For Basic Editing (Medium):
1. **Blender** - Free, full-featured, learning curve but lots of tutorials
2. **SketchUp Free** ([sketchup.com](https://www.sketchup.com/)) - Web-based, easier than Blender

### For Quick Rotation Fixes (Fast):
1. **Online GLTF editors** - No install needed, rotate and download
2. **Babylon.js Sandbox** - View and debug GLTF models in browser

## Troubleshooting Checklist

- [ ] Model file is in `public/assets/models/` directory
- [ ] File is named correctly (e.g., `forklift.glb`)
- [ ] Model front faces -Z (or -Y in Blender)
- [ ] Model base is at Y=0 (ground level)
- [ ] Textures are embedded (if using GLB)
- [ ] No console errors in browser (F12)
- [ ] Tested with "Start Mission" - vehicle moves forward correctly
- [ ] Containers appear in front of vehicle

## Need Help?

**Quick Fix:** Try rotating your model 90° at a time until it works:
1. Export as GLB from your 3D software
2. Test in app
3. If wrong, rotate another 90° and re-export
4. Repeat until correct (max 4 tries!)

**For beginners:** Download a model from Sketchfab that already faces the correct direction, then use it as a reference for your own models.
