# Shared Module

This folder contains code that is shared across multiple modules or acts as a central coordinator.

## Responsibilities
- **Global Constants**: `constants.ts` (map dimensions, icons, etc.).
- **Shared Types**: `types.ts` defining common interfaces used across boundaries.
- **State Orchestration**: `useGameState.ts` which aggregates state from `/ui`, `/map`, and `/ruler`.
- **Singletons**: `threeSingleton.ts` for managing shared Three.js renderers.

## Usage
- Use `@shared/*` path aliases to import from this folder.
- The `useGameState` hook should be the primary way for UI components to access global game data.
