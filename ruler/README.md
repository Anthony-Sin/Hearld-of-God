# Ruler Module

This folder contains logic related to the player's character (the Herald), including their visual representation and internal state.

## Responsibilities
- **Character Rendering**: `VoxelCharacter.tsx` for the 3D voxel portrait, which dynamically responds to stats and traits.
- **Ruler State**: Managed in `state.ts`, handling Herald-specific stats, traits, and resource management.

## Herald Character System

### HeraldStats Interface
```typescript
export interface HeraldStats {
  // Mortal Stats (1-20 range)
  authority: number; // Ability to command feudal lords
  zeal: number;      // Devotion to the divine mission
  cunning: number;   // Intrigue and political maneuvering
  valor: number;     // Personal combat and military leadership
  wisdom: number;    // Learning and arcane knowledge

  // Divine Stats (0-100 range)
  divinity: number;   // Connection to the divine source
  corruption: number; // Mortal world taint
  renown: number;     // Legendary status (accumulating)
  piety: number;      // Religious standing (spendable)
}
```

### Trait System
The Herald can possess various traits that modify their stats and visual appearance:

**Divine Traits**
- `Chosen One`: +10 divinity, golden halo effect.
- `Fallen`: Corruption cannot be reduced below 20.
- `Miracle Worker`: +25% Piety generation.
- `Voice of God`: +2 Authority.

**Mortal Traits**
- `Brilliant`: +3 Wisdom, golden halo effect.
- `Wrathful`: +2 Valor, -1 Authority.
- `Schemer`: +3 Cunning, -1 Zeal.
- `Just`: +2 Authority, +1 Zeal.
- `Craven`: -2 Valor, hunched posture and paler complexion.

**Physical Traits**
- `Ancient`: Aged appearance (grey tones), +1 Wisdom.
- `Towering`: Larger model (1.15x height, 1.1x width), +1 Valor.
- `Scarred`: Random dark voxels on body, +1 Valor.

### Portrait Dynamics
The `VoxelCharacter` component updates in real-time based on the Herald's state:
- **Divinity**: Above 70 (or `Brilliant`/`Chosen One` trait) adds a golden particle halo. Below 30 applies programmatic desaturation.
- **Corruption**: Above 70 adds dark/purple smoke at the feet and causes purple "bleed" on outer voxels.
- **Renown Milestones**:
  - 100: Golden Crown
  - 250: Substantial Cloak
  - 500: Glowing Orb in hand
- **Physical Traits**: `Ancient` (desaturation), `Towering` (scaling), `Scarred` (damage marks), `Craven` (posture shift).

## Interface
- Exports `VoxelCharacter` component for rendering the Herald.
- Exports `useRulerState` for managing Herald data, providing `computedStats`, `addTrait`, `removeTrait`, and `setStat`.
- Exports `HeraldStats` and `Trait` types.
