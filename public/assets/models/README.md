# 3D Models Directory

Place your GLTF/GLB 3D models here for the warehouse vehicles.

## 🚀 Easy Model Loading with Automatic Pattern Matching

**Just place one file per vehicle type!** The system will automatically find it regardless of rotation tags.

### Supported File Names

For each vehicle type, place **any one** of these naming patterns:
- `forklift.glb` or `forklift-rotY90.glb` or `forklift-rotY180.glb` (any rotation)
- `pallet-jack.glb` or `pallet-jack-rotY-90.glb` (any rotation)
- `stacker.glb` or `stacker-rotZ45.glb` (any rotation)
- `container.glb` or `container-rotY180.glb` (any rotation)

**The app will automatically detect and load the first matching file for each type!**

## 🎯 Rotation Tags (Easy Model Alignment!)

**No need to edit the model in 3D software!** You can now rotate models using filename tags:

### Filename Format

`{vehicle-type}-rotY{degrees}-rotZ{degrees}.glb`

### Rotation Tag Examples

- `forklift-rotY90.glb` - Rotate 90° around Y axis (left/right turn)
- `pallet-jack-rotY-90.glb` - Rotate -90° around Y axis
- `forklift-rotY180.glb` - Rotate 180° (face opposite direction)
- `stacker-rotZ90.glb` - Rotate 90° around Z axis (tilt sideways)
- `forklift-rotY90-rotZ45.glb` - Multiple rotations (Y first, then Z)
- `container-rotY180-rotX45.glb` - Container with compound rotation

### Supported Rotation Tags

- `-rotX{degrees}` - Rotate around X axis (pitch: up/down tilt)
- `-rotY{degrees}` - Rotate around Y axis (yaw: left/right turn)
- `-rotZ{degrees}` - Rotate around Z axis (roll: sideways tilt)

Values can be positive or negative integers (e.g., `90`, `-90`, `180`, `45`, `-45`)

### How It Works

1. Download your model (e.g., from Sketchfab)
2. **Rename it** to match vehicle type + rotation (e.g., `forklift-rotY90.glb`)
3. Place in `/public/assets/models/` directory
4. **That's it!** The system will automatically find and load your model
5. **No need to open Blender or other 3D software!**
6. Restart the dev server and the model will be loaded with proper rotation

### Common Rotation Fixes

| Issue | Solution |
|-------|----------|
| Model faces left | `forklift-rotY90.glb` |
| Model faces right | `forklift-rotY-90.glb` |
| Model faces backward | `forklift-rotY180.glb` |
| Model is sideways | `forklift-rotZ90.glb` |
| Model is upside-down | `forklift-rotZ180.glb` |

### Example Workflow

1. Download forklift model: `my-forklift-model.glb`
2. **Test first with base name**: Rename to `forklift.glb`
3. Place in `/public/assets/models/`
4. Test in app → Model faces left ❌
5. **Just rename the same file**: `forklift-rotY90.glb`
6. Restart dev server
7. Test → Model faces forward ✅

**Note**: The system tries common rotation patterns automatically. If your model loads rotated wrong, just rename the file with the appropriate rotation tag!

### Pattern Matching Details

The system automatically tries these patterns (in order):
1. Base name (`forklift.glb`, `forklift.gltf`)
2. Common rotations (`forklift-rotY90.glb`, `forklift-rotY-90.glb`, etc.)
3. Falls back to procedural geometry if no file found

**You only need ONE file per vehicle type.** Name it with the rotation that works!

### Console Messages

The browser console will show which file was loaded:
```
✅ Loaded external model: forklift-rotY90.glb
   Applying rotations from filename: X=0° Y=90° Z=0°
```

## Model Requirements

- **Format**: GLTF (.gltf) or GLB (.glb) - GLB is recommended (binary, smaller size)
- **Size**: Keep files under 10MB for good loading performance
- **Scale**: Models will be automatically scaled to fit the scene (approximately 3 units height)
- **Textures**: Should be embedded in GLB or placed in the same directory
- **Origin**: Model should be centered at origin with base at Y=0

## Where to Find Models

Good sources for free/paid 3D models:

- **Sketchfab**: https://sketchfab.com/ (many free models, use "Download 3D Model" → GLTF format)
- **TurboSquid**: https://www.turbosquid.com/
- **CGTrader**: https://www.cgtrader.com/
- **Free3D**: https://free3d.com/

## Example from Sketchfab

1. Go to https://skfb.ly/pE768 (or any forklift model)
2. Click "Download 3D Model"
3. Select "Autoconverted format (glTF)"
4. Extract the ZIP file
5. Rename the `.glb` file to `forklift.glb`
6. Place in this directory

## Texture Issues

If your model loads but textures are missing:
1. Ensure textures are embedded in the GLB file (recommended)
2. Or place texture files in the same directory as the .gltf file
3. Check that texture paths in the .gltf file are relative, not absolute
4. Use GLB format for best compatibility (it embeds everything)

## Fallback Behavior

If external models are not found, the application will automatically use procedurally generated geometric models as fallback. This ensures the app always works even without custom models.

## Container Models

Containers/bins can also be loaded as external models. If `container.glb` is present, it will be used for all container instances. Otherwise, procedural geometry is used.

## Testing

After adding models:
1. Restart the dev server (`npm start`)
2. Select the vehicle type
3. Check the browser console for loading messages:
   - ✅ "Loaded external model for {type}" = Success
   - ℹ️ "External model not found..." = Using fallback geometry
