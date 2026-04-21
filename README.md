# Herald of God

A grand strategy board simulation where you rule over a high-fantasy voxel world.

## Project Overview

"Herald of God" is a procedural grand strategy game built with React, Three.js, and Vite. Players manage a sovereign ruler, oversee resources, and interact with a detailed, hierarchically organized voxel map.

## Architecture

The codebase has been refactored into a modular, multi-agent-ready structure to allow parallel development on distinct game domains:

- **`/ui`**: Layout, HUD, menus, and application entry points.
- **`/map`**: Procedural world generation, terrain logic, and 3D map rendering.
- **`/ruler`**: Character stats, traits, AI behavior, and the voxel character portrait.
- **`/shared`**: Central state orchestration, shared types, constants, and utilities.

### Key Technologies
- **React 19**: UI and component management.
- **Three.js**: 3D rendering for both the world map and character portrait.
- **Vite**: Modern build tool and dev server.
- **Tailwind CSS**: Styling and layout.
- **Motion (Framer Motion)**: Smooth UI animations and transitions.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Game
```bash
npm run dev
```
The game will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```

## Suggested Improvements

### Gameplay & Logic
- **Diplomacy System**: Implement a system for alliances, marriages, and declarations of war.
- **Warfare**: Add unit movement and combat logic on the voxel map.
- **Dynasty Management**: Expand the Ruler logic to include heirs and family trees.
- **AI Rulers**: Implement autonomous behavior for non-player rulers across the map.

### Technical & UI
- **Map Optimization**: Offload map generation to a Web Worker for smoother startup.
- **Persistence**: Add save/load functionality using LocalStorage or a backend.
- **Audio**: Implement a dynamic soundtrack and ambient world sounds.
- **Accessibility**: Enhance keyboard navigation and screen reader support for the HUD.

---

*Refactored for Multi-Agent AI Development by Jules.*
