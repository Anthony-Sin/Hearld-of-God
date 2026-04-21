# Map Module

This folder handles world generation, terrain processing, and the 3D voxel map rendering.

## Responsibilities
- **Map Generation**: Procedural terrain and territory hierarchy (Barony -> County -> Duchy -> Kingdom -> Empire).
- **Voxel Rendering**: `VoxelMap.tsx` and modular hooks for scene setup, meshes, labels, and picking.
- **Camera**: Map-specific camera and control logic.
- **Map State**: Managed in `state.ts`, handling map data, selection, and regeneration.

## Recent Overhaul: CK3-Style Province System
The map has been transformed from basic height-colored terrain into a politically legible grand strategy map.

### Map Modes
- **Political**: Colors provinces based on their top-level Empire owner. As you zoom in (LOD), colors shift to reflect lower-level owners (Duchy/County) for finer political resolution.
- **Terrain**: Naturalistic colors based on assigned biomes and voxel height.
- **Culture**: Displays the cultural distribution across the map.

### Procedural Generation & Biomes
Map generation uses a seeded PRNG (`mulberry32`) for deterministic results.
- **Biomes**: Each region is assigned one of 6 biomes: `plains`, `forest`, `desert`, `tundra`, `mountain`, or `wetlands`.
- **Clustering**: Biomes and cultures are clustered at the Duchy level to create cohesive geographic regions.
- **Terrain Influence**: Biomes affect both color and voxel height variance (e.g., spiky mountains vs. flat plains). `wetlands` feature low-lying, water-colored flats.

### Visual Clarity & LOD
- **Hierarchical Borders**:
  - Barony: Thin lines.
  - County: Medium lines.
  - Duchy/Kingdom/Empire: Thick, glowing borders.
- **Dynamic 3D Labels**: Empire, Duchy, County, and Barony labels use 3D billboards that stay on top. They scale and fade based on camera distance (`lodLevel`).
- **Selection Highlight**: Selected provinces feature a pulsing rim glow effect on their voxel edges.

### Technical Changes
- **New Files**:
  - `map/useBorders.ts`: Hierarchical border rendering logic.
  - `map/useSelectionHighlight.ts`: Selection pulsing effect.
  - `map/labelUtils.ts` & `map/useVoxelLabels.ts`: Billboard label management and collision avoidance.
  - `map/prng.ts`: Seeded random number generator.
- **State Changes (`state.ts`)**:
  - Added `mapMode` (`'political' | 'terrain' | 'culture'`).
  - Added `lodLevel` (`'empire' | 'duchy' | 'county' | 'barony'`).
  - Added `currentSeed` and `regenerateWithSeed(seed)`.
- **Types (`types.ts`)**:
  - `Territory` updated with `biome` and `culture` fields.
  - `MapData` updated with `seed`.
- **Rendering**:
  - `useVoxelMeshes.ts` overhauled for dynamic vertex coloring to support map modes without mesh recreation.
  - `mapGenerator.ts` and `hierarchyBuilder.ts` updated for biome/culture logic and height variance.

## Interface
- Exports `VoxelMap` component for rendering the world.
- Exports `useMapState` hook for UI interaction with the map.
- Exports `MapData`, `MapMode`, and `LODLevel` types.
