# Ruler Module

This folder contains logic related to the player's character (the Ruler), including their visual representation and internal state.

## Responsibilities
- **Character Rendering**: `VoxelCharacter.tsx` for the 3D voxel portrait.
- **Ruler State**: Managed in `state.ts`, handling resources (gold, prestige, etc.), traits, and future AI/decision logic.
- **AI Behavior**: Placeholder for future character-driven decision making.

## Interface
- Exports `VoxelCharacter` component for rendering the ruler.
- Exports `useRulerState` for managing ruler-specific data.
