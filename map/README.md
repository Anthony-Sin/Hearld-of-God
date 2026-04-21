# Map Module

This folder handles world generation, terrain processing, and the 3D voxel map rendering.

## Responsibilities
- **Map Generation**: Procedural terrain and territory hierarchy (Barony -> County -> Duchy -> Kingdom -> Empire).
- **Voxel Rendering**: `VoxelMap.tsx` and modular hooks for scene setup, meshes, labels, and picking.
- **Camera**: Map-specific camera and control logic.
- **Map State**: Managed in `state.ts`, handling map data, selection, and regeneration.

## Interface
- Exports `VoxelMap` component for rendering the world.
- Exports `useMapState` for managing map data and selection.
- Exports `MapData` and related types.
