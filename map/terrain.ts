import { createNoise2D } from 'simplex-noise';
import { TerrainType, VoxelData } from './types';

export function generateTerrain(width: number, depth: number, random: () => number) {
  const noise2D = createNoise2D(random);
  const forestNoise = createNoise2D(random);
  const tempNoise = createNoise2D(random); // For temperature/biome variation
  const moistureNoise = createNoise2D(random); // For swamp/wasteland
  
  const voxels: VoxelData[] = [];
  const landPoints: { x: number; z: number }[] = [];

  for (let z = 0; z < depth; z++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const nz = z / depth;
      
      // Multi-octave elevation
      const e1 = 1.00 * noise2D(nx * 2.5, nz * 2.5);
      const e2 = 0.50 * noise2D(nx * 5.0, nz * 5.0);
      const e3 = 0.25 * noise2D(nx * 10.0, nz * 10.0);
      const e4 = 0.12 * noise2D(nx * 20.0, nz * 20.0);
      let elevation = (e1 + e2 + e3 + e4) / 1.87;
      
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
        const temp = tempNoise(nx * 3, nz * 3);
        const moisture = moistureNoise(nx * 4, nz * 4);
        
        if (elevation > 0.75) { 
          type = 'snow'; 
          height = 5; 
        } else if (elevation > 0.58) { 
          type = 'mountain'; 
          height = 4; 
        } else if (elevation > 0.38) { 
          type = 'hill'; 
          height = 3; 
        } else if (elevation < 0.15) {
          if (moisture > 0.4 && temp > 0) {
            type = 'swamp';
            height = 1;
          } else {
            type = 'sand';
            height = 1;
          }
        } else if (temp < -0.4) {
          type = 'tundra';
          height = 1;
        } else if (moisture < -0.5) {
          type = 'wasteland';
          height = 1;
        } else if (forestVal > 0.25) {
          type = 'forest';
          height = 2; // Taller forest
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
