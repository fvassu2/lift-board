# 3D Models Directory

Place your GLTF/GLB 3D models here for the warehouse vehicles.

## Required Files

- `forklift.glb` or `forklift.gltf` - Forklift model
- `pallet-jack.glb` or `pallet-jack.gltf` - Pallet jack model  
- `stacker.glb` or `stacker.gltf` - Stacker model
- `container.glb` or `container.gltf` - Container/bin model (optional)

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
