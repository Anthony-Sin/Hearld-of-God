# Map Module

This folder handles world generation, terrain processing, and the 3D voxel map rendering.

## Responsibilities
- **Map Generation**: Procedural terrain and territory hierarchy (Barony -> County -> Duchy -> Kingdom -> Empire).
- **Voxel Rendering**: `VoxelMap.tsx` and modular hooks for scene setup, meshes, labels, and picking.
- **Camera**: Map-specific camera and control logic.
- **Map State**: Managed in `state.ts`, handling map data, selection, and regeneration.

## Recent Overhaul: CK3-Style Province System
The map has been transformed from basic height-colored terrain into a politically legible grand strategy map.

### New Features
- **Map Modes**: Toggle between Political (realm owner), Terrain (biome-based), and Culture modes.
- **Hierarchical Borders**: Distinct visual lines for different administrative levels (thin for Barony, thick/glowing for Duchy+).
- **Procedural Biomes**: 6 distinct biomes (Plains, Forest, Desert, Tundra, Mountain, Wetlands) influencing height and color.
- **Seeded Generation**: Reproducible maps using a numeric seed.
- **Dynamic 3D Labels**: Empire, Duchy, County, and Barony labels that scale and fade based on camera distance (LOD).
- **Selection Highlight**: Selected provinces feature a pulsing rim glow effect.

### Technical Changes
- **State (`state.ts`)**:
    - Added `mapMode`, `lodLevel`, and `currentSeed`.
    - Exposed `setMapMode` and `regenerateWithSeed`.
- **Types (`types.ts`)**:
    - `Territory` now includes `biome` and `culture`.
    - Added `MapMode` and `LODLevel` enums.
- **New Hooks/Utils**:
    - `useBorders.ts`: Renders hierarchical border lines.
    - `useSelectionHighlight.ts`: Handles the selection pulsing effect.
    - `labelUtils.ts`: Manages 3D text label placement and visibility.
- **Rendering**: `useVoxelMeshes.ts` now uses dynamic vertex coloring for instant map mode switching.

## Interface
- Exports `VoxelMap` component for rendering the world.
- Exports `useMapState` for managing map data, selection, and map modes.
- Exports `MapData` and related types.
