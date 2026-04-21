# Agent Guidelines - Herald of God Refactor

This document provides context for AI agents working on this modularized codebase.

## Codebase Refactor Summary

The project has been split into four isolated domains to facilitate parallel development. Each domain should remain as self-contained as possible.

### 1. Root Folders & Ownership
- **`/ui` (UI Agent)**: Owns everything in the DOM and HUD. Does NOT touch 3D rendering logic directly, but consumes components from `/map` and `/ruler`.
- **`/map` (Map Agent)**: Owns the world. Responsible for terrain generation, hierarchy logic, and Three.js map rendering. Changes here should focus on geography and world-state generation.
- **`/ruler` (Ruler Agent)**: Owns the player character. Responsible for stats, AI logic, and the character portrait.
- **`/shared` (Core/Lead Agent)**: Owns the glue. Central types, constants, and the `useGameState` orchestrator.

### 2. Import Rules
- **Path Aliases**: Always use the `@` aliases (e.g., `@ui`, `@map`, `@ruler`, `@shared`).
- **Boundaries**:
  - Modules can import from `@shared`.
  - `/ui` can import from `@map` and `@ruler` (for components).
  - Avoid circular dependencies between `/map` and `/ruler`.

### 3. State Management
- Local domain state is kept in `[folder]/state.ts`.
- Domain states are aggregated in `@shared/useGameState.ts`.
- If you need to add global state, update the domain `state.ts` and then expose it through `useGameState.ts`.

### 4. Style & Performance
- Use **Tailwind CSS** for UI.
- Use **Motion** for HUD animations.
- For Three.js, use the `rendererPool` from `@shared/threeSingleton.ts` to avoid creating multiple renderer instances.

## Recent Changes
- Refactored from monolithic `src` to modular root folders.
- Fixed map labels and province detail panel hierarchy.
- Standardized project entry to `/ui/main.tsx`.
