# Herald of God - UI Module

This module contains the HUD and interface components for "Herald of God", a fantasy grand strategy game.

## CK3-Inspired HUD Overhaul Summary

The UI has been rebuilt from the ground up to match a dark medieval / fantasy aesthetic, heavily inspired by the information-dense yet readable architecture of Crusader Kings 3.

### New Components

1.  **TopBar.tsx**:
    *   **Herald Resources (Left)**: Gold, Piety, Renown, and Prestige with live monthly deltas.
    *   **The Divine Balance (Center)**: A dual-track meter showing Divinity (left-to-right) vs. Corruption (right-to-left). Features pulsing red glow if Corruption dominates and a golden glow for high Divinity (>80).
    *   **Realm Info (Right)**: Player name, stylized medieval date, voxel/domain stats, and settings access.
2.  **ProvinceDetail.tsx**:
    *   Slide-in panel from the right on province selection.
    *   **Hierarchy Breadcrumb**: Navigable path from Empire down to County in realm colors.
    *   **Culture & Religion Row**: Visual badges for province identity.
    *   **Development Section**: Progress bars for Development Level, Infrastructure, Military, and Arcane stats.
    *   **Herald Actions**: Interactive buttons (e.g., "BLESS PROVINCE") with Piety validation and tooltips.
3.  **PortraitHUD.tsx**:
    *   Ornate circular frame for the Herald's voxel character.
    *   **Stat Badge Arc**: Interactive icons for Authority, Zeal, Cunning, Valor, and Wisdom with hover expansion.
    *   **Active Traits Bar**: Compact square badges for Herald traits with tooltips and overflow handling.
    *   **Mini-Balance Bars**: Compact versions of the Divinity/Corruption tracks.
4.  **DateHUD.tsx**:
    *   Minimalist game speed controller and speed indicators.
5.  **ActionModals.tsx**:
    *   A centralized component for various game interaction modals (Settings, etc.).

### State Changes (ui/state.ts)

*   **Resources State**: Added support for monthly deltas and animated transitions.
*   **Notifications**: Implemented a toast notification system for game actions.
*   **Herald Info**: Centralized player name and title state.
*   **Divine Balance**: Added state for Divinity and Corruption values.
*   **Stats & Traits**: Integrated Herald stats and trait data for portrait HUD rendering.

### Visual Language

*   **Typography**: Using 'Cinzel' for gothic headers and 'Crimson Text' for serif body text.
*   **Colors**: Dark parchment (`bg-stone-900`), Gold (`text-amber-400`), and muted stone (`text-stone-300`).
*   **Animations**: Staggered entrance animations using Framer Motion on all main HUD clusters.

## Technical Notes

*   All UI data is consumed via the `useGameState` hook which aggregates data from modular states.
*   Component interactions (Bless, Investigate) are handled through shared state actions to ensure sync with the game engine.
*   The map layout dynamically adjusts to the `ProvinceDetail` panel visibility to prevent UI overlap.
