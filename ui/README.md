# UI Module

This folder contains all logic related to the user interface, layout, and non-spatial interactions.

## Responsibilities
- **Application Entry Points**: `main.tsx` and `App.tsx` (layout orchestration).
- **HUD Components**: TopBar, PortraitHUD, ProvinceDetail, DateHUD.
- **Menus**: StartMenu.
- **UI State**: Managed in `state.ts`, handling visibility of modals, game speed, and start state.

## Interface
- Exports `useUIState` for local UI state management.
- Consumes global state from `@shared/useGameState.ts`.
- Uses components from `@map` and `@ruler` to render the game world and character.
