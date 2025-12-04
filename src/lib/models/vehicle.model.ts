/**
 * 3D model transformation configuration
 */
export interface ModelTransformation {
  x: number;
  y: number;
  z: number;
}

/**
 * 3D model configuration for external GLTF/GLB files
 */
export interface ModelConfig {
  filename: string;
  rotation: ModelTransformation;
  translation: ModelTransformation;
}

/**
 * Vehicle interface representing different warehouse vehicle types
 */
export interface Vehicle {
  id: string;
  name: string;
  type: 'forklift' | 'pallet-jack' | 'stacker';
  maxCapacity: number;
  icon?: string;
  modelConfig?: ModelConfig;
}
