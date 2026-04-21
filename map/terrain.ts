import { createNoise2D } from 'simplex-noise';
import { TerrainType, VoxelData } from './types';

export function generateTerrain(width: number, depth: number, random: () => number) {
  const noise2D = createNoise2D(random);
  const forestNoise = createNoise2D(random);
  const tempNoise = createNoise2D(random); // Global temperature
  const moistureNoise = createNoise2D(random); // Global moisture
  
  const voxels: VoxelData[] = [];
  const landPoints: { x: number; z: number }[] = [];

  for (let z = 0; z < depth; z++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const nz = z / depth;
      
      // Multi-octave elevation (Smoother, less chaotic)
      const e1 = 1.00 * noise2D(nx * 1.5, nz * 1.5);
      const e2 = 0.40 * noise2D(nx * 3.0, nz * 3.0);
      const e3 = 0.15 * noise2D(nx * 6.0, nz * 6.0);
      let elevation = (e1 + e2 + e3) / 1.55;
      
      // Island mask - circular with some jitter
      const dx = (nx - 0.5) * 2;
      const dz = (nz - 0.5) * 2;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const mask = 1 - Math.pow(dist, 2.5);
      elevation = (elevation + 0.12) * mask;

      let type: TerrainType = 'water';
      let height = 0;

      if (elevation > 0.08) {
        const forestVal = forestNoise(nx * 8, nz * 8);
        const temp = tempNoise(nx * 1.2, nz * 1.2); // Much lower frequency for global biomes
        const moisture = moistureNoise(nx * 1.2, nz * 1.2);
        
        if (elevation > 0.82) {
          type = 'snow'; 
          height = 4; 
        } else if (elevation > 0.65) {
          type = 'mountain';
          height = 3; 
        } else if (elevation > 0.45) {
          type = 'hill';
          height = 2;
        } else if (temp > 0.4 && moisture < -0.2) {
          type = 'sand';
          height = 1;
        } else if (temp < -0.3) {
          type = 'tundra';
          height = 1;
        } else if (moisture > 0.4) {
          type = 'swamp';
          height = 1;
        } else if (forestVal > 0.3) {
          type = 'forest';
          height = 1;
        } else { 
          type = 'plains'; 
          height = 1; 
        }
        landPoints.push({ x, z });
      } else {
        // Water tiers
        if (elevation < -0.4) {
            type = 'deep_water';
            height = 0;
        } else {
            type = 'water';
            height = 0;
        }
      }
      voxels.push({ x, z, height, type, provinceId: -1, provinceColor: '#ffffff' });
    }
  }

  return { voxels, landPoints };
}
