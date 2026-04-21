export type TerrainType = 'land' | 'water' | 'deep_water' | 'mountain' | 'hill' | 'plains' | 'river' | 'forest' | 'snow' | 'sand' | 'swamp' | 'wasteland' | 'tundra';

export type Biome = 'plains' | 'forest' | 'desert' | 'tundra' | 'mountain' | 'wetlands';

export type MapMode = 'political' | 'terrain' | 'followers';

export type LODLevel = 'empire' | 'duchy' | 'county' | 'barony';

export type ViewLevel = 'County' | 'Duchy' | 'Kingdom' | 'Empire';

export interface VoxelData {
  x: number;
  z: number;
  height: number;
  type: TerrainType;
  provinceId: number; 
  provinceColor: string;
}

export interface HierarchyEntity {
  id: number;
  name: string;
  color: string;
  x: number;
  z: number;
  rotation: number;
  area: number;
}

export interface BaronyData {
  id: number;
  name: string;
  color: string;
  biome: Biome;
  culture: string;
  religion: string;
  development: number;
  x: number;
  z: number;
  rotation: number;
  area: number;
  countyId: number;
  duchyId: number;
  kingdomId: number;
  empireId: number;
  flag: {
    primaryColor: string;
    secondaryColor: string;
    symbol: string;
  };
  gold: number;
  prestige: number;
  piety: number;
  renown: number;
  followerCount: number;
  maxFollowers: number;
}

export interface MapHierarchy {
  baronies: BaronyData[];
  counties: Record<number, HierarchyEntity>;
  duchies: Record<number, HierarchyEntity>;
  kingdoms: Record<number, HierarchyEntity>;
  empires: Record<number, HierarchyEntity>;
}

export interface MapData extends MapHierarchy {
  seed: number;
  voxels: VoxelData[];
  width: number;
  depth: number;
}

export const TINTS = [
  '#e63946', '#a8dadc', '#457b9d', '#1d3557', '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', 
  '#43aa8b', '#577590', '#277da1', '#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607',
  '#ee6055', '#60d394', '#aafcb8', '#ff9b54', '#ff70a6', '#70d6ff', '#ff9770', '#ffd670',
  '#8187dc', '#edff12', '#2df42e', '#ff0054', '#a9d6e5'
];
