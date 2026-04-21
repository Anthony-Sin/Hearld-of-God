import { MapData, VoxelData, BaronyData, HierarchyEntity } from './types';
import { generateTerrain } from './terrain';
import { buildHierarchy } from './hierarchy';
import { processTerritoryCenters } from './geometry';
import { createNoise2D } from 'simplex-noise';

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateMap(width: number, depth: number, seed: number): MapData {
  const random = mulberry32(seed);
  
  // 1. Terrain Construction
  const { voxels, landPoints } = generateTerrain(width, depth, random);

  // 2. Multi-Tier Hierarchy Construction
  const { baronies, counties, duchies, kingdoms, empires } = buildHierarchy(landPoints, random);

  // Initialize barony follower data
  baronies.forEach(b => {
    b.maxFollowers = 100 + Math.floor(random() * 900);
    b.followerCount = Math.floor(random() * b.maxFollowers * 0.2); // Start with small percentage
  });

  // 3. Voxel-to-Territory Voronoi Mapping
  voxels.forEach(v => {
    if (v.type !== 'water' && v.type !== 'deep_water') {
      let minDist = Infinity;
      let nearestId = 0;
      baronies.forEach((b) => {
        const dx = v.x - b.x;
        const dz = v.z - b.z;
        const dist = dx * dx + dz * dz;
        if (dist < minDist) { minDist = dist; nearestId = b.id; }
      });
      v.provinceId = nearestId;
      v.provinceColor = baronies[nearestId]?.color || '#ffffff';

      // Update barony biome based on the voxel's natural terrain type
      // This ensures biomes are cohesive and based on terrain, not patchy.
      const barony = baronies[nearestId];
      if (barony) {
        if (v.type === 'mountain' || v.type === 'snow') barony.biome = 'mountain';
        else if (v.type === 'sand') barony.biome = 'desert';
        else if (v.type === 'tundra') barony.biome = 'tundra';
        else if (v.type === 'swamp') barony.biome = 'wetlands';
        else if (v.type === 'forest') barony.biome = 'forest';
        else barony.biome = 'plains';
      }
    }
  });

  // 4. Territory Metadata Analysis (Centroids & Orientation)
  const voxByBarony: Record<number, {x:number, z:number}[]> = {};
  const voxByCounty: Record<number, {x:number, z:number}[]> = {};
  const voxByDuchy: Record<number, {x:number, z:number}[]> = {};
  const voxByKingdom: Record<number, {x:number, z:number}[]> = {};
  const voxByEmpire: Record<number, {x:number, z:number}[]> = {};

  voxels.forEach(v => {
    if (v.type !== 'water' && v.type !== 'deep_water' && v.provinceId !== -1) {
      const b = baronies[v.provinceId];
      if (!voxByBarony[b.id]) voxByBarony[b.id] = [];
      voxByBarony[b.id].push({ x: v.x, z: v.z });

      if (!voxByCounty[b.countyId]) voxByCounty[b.countyId] = [];
      voxByCounty[b.countyId].push({ x: v.x, z: v.z });

      if (!voxByDuchy[b.duchyId]) voxByDuchy[b.duchyId] = [];
      voxByDuchy[b.duchyId].push({ x: v.x, z: v.z });

      if (!voxByKingdom[b.kingdomId]) voxByKingdom[b.kingdomId] = [];
      voxByKingdom[b.kingdomId].push({ x: v.x, z: v.z });

      if (!voxByEmpire[b.empireId]) voxByEmpire[b.empireId] = [];
      voxByEmpire[b.empireId].push({ x: v.x, z: v.z });
    }
  });

  // Apply geometry logic to all tiers
  processTerritoryCenters(baronies.reduce((acc, b) => ({ ...acc, [b.id]: b }), {}), voxByBarony);
  processTerritoryCenters(counties, voxByCounty);
  processTerritoryCenters(duchies, voxByDuchy);
  processTerritoryCenters(kingdoms, voxByKingdom);
  processTerritoryCenters(empires, voxByEmpire);

  return { seed, voxels, baronies, counties, duchies, kingdoms, empires, width, depth };
}

export type { MapData, BaronyData, VoxelData, HierarchyEntity };
