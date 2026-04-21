import { useState, useCallback, useMemo } from 'react';

export interface HeraldStats {
  // Mortal Stats
  authority: number;
  zeal: number;
  cunning: number;
  valor: number;
  wisdom: number;
  // Divine Stats
  divinity: number;
  corruption: number;
  renown: number;
  piety: number;
}

export type TraitCategory = 'divine' | 'mortal' | 'physical';

export interface Trait {
  id: string;
  name: string;
  category: TraitCategory;
  description: string;
  statModifiers: Partial<HeraldStats>;
}

export const TRAITS: Record<string, Trait> = {
  'chosen_one': {
    id: 'chosen_one',
    name: 'Chosen One',
    category: 'divine',
    description: 'Marked by the divine for a great purpose. +10 divinity cap, unique golden glow on portrait.',
    statModifiers: { divinity: 10 } // Assuming +10 to current divinity for now, or we handle cap separately
  },
  'fallen': {
    id: 'fallen',
    name: 'Fallen',
    category: 'divine',
    description: 'The divine light has dimmed. Corruption cannot be reduced below 20.',
    statModifiers: { corruption: 10 }
  },
  'miracle_worker': {
    id: 'miracle_worker',
    name: 'Miracle Worker',
    category: 'divine',
    description: 'A conduit for miracles. Piety generation +25%.',
    statModifiers: {}
  },
  'voice_of_god': {
    id: 'voice_of_god',
    name: 'Voice of God',
    category: 'divine',
    description: 'The Herald speaks with the authority of the heavens. Authority +2.',
    statModifiers: { authority: 2 }
  },
  'brilliant': {
    id: 'brilliant',
    name: 'Brilliant',
    category: 'mortal',
    description: 'A mind like a diamond. +3 Wisdom, portrait shows a glowing halo.',
    statModifiers: { wisdom: 3 }
  },
  'wrathful': {
    id: 'wrathful',
    name: 'Wrathful',
    category: 'mortal',
    description: 'Quick to anger, slow to forgive. +2 Valor, -1 Authority.',
    statModifiers: { valor: 2, authority: -1 }
  },
  'schemer': {
    id: 'schemer',
    name: 'Schemer',
    category: 'mortal',
    description: 'A master of shadows and whispers. +3 Cunning, -1 Zeal.',
    statModifiers: { cunning: 3, zeal: -1 }
  },
  'just': {
    id: 'just',
    name: 'Just',
    category: 'mortal',
    description: 'Fair and impartial. +2 Authority, +1 Zeal.',
    statModifiers: { authority: 2, zeal: 1 }
  },
  'craven': {
    id: 'craven',
    name: 'Craven',
    category: 'mortal',
    description: 'Fear is a constant companion. -2 Valor, portrait changes posture.',
    statModifiers: { valor: -2 }
  },
  'ancient': {
    id: 'ancient',
    name: 'Ancient',
    category: 'physical',
    description: 'Weathered by centuries. Appears aged with grey tones.',
    statModifiers: { wisdom: 1 }
  },
  'towering': {
    id: 'towering',
    name: 'Towering',
    category: 'physical',
    description: 'A physical giant among men. Model is taller and wider.',
    statModifiers: { valor: 1 }
  },
  'scarred': {
    id: 'scarred',
    name: 'Scarred',
    category: 'physical',
    description: 'The body bears the marks of many trials. Small dark voxels on face/body.',
    statModifiers: { valor: 1 }
  }
};

export function useRulerState() {
  const [stats, setStats] = useState<HeraldStats>({
    authority: 8,
    zeal: 8,
    cunning: 8,
    valor: 8,
    wisdom: 8,
    divinity: 40,
    corruption: 10,
    renown: 0,
    piety: 50
  });

  const [resources, setResources] = useState({
    gold: 150,
    followers: 10
  });

  const [traitIds, setTraitIds] = useState<string[]>(['just', 'chosen_one']);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [abilityCooldowns, setAbilityCooldowns] = useState<Record<string, number>>({});

  const addTrait = useCallback((traitId: string) => {
    setTraitIds(prev => prev.includes(traitId) ? prev : [...prev, traitId]);
  }, []);

  const removeTrait = useCallback((traitId: string) => {
    setTraitIds(prev => prev.filter(id => id !== traitId));
  }, []);

  const setStat = useCallback((stat: keyof HeraldStats, value: number) => {
    setStats(prev => {
      let newValue = value;
      // Handle special logic like Fallen trait
      if (stat === 'corruption' && traitIds.includes('fallen')) {
        newValue = Math.max(20, value);
      }
      // Clamp stats as appropriate
      if (['divinity', 'corruption'].includes(stat)) {
        newValue = Math.max(0, Math.min(100, newValue));
      }

      return { ...prev, [stat]: newValue };
    });
  }, [traitIds]);

  const computedStats = useMemo(() => {
    const base = { ...stats };
    traitIds.forEach(id => {
      const trait = TRAITS[id];
      if (trait) {
        Object.entries(trait.statModifiers).forEach(([stat, mod]) => {
          const key = stat as keyof HeraldStats;
          base[key] += mod || 0;
        });
      }
    });
    return base;
  }, [stats, traitIds]);

  const updateResources = useCallback((delta: Record<string, number>) => {
    if (delta.gold !== undefined || delta.followers !== undefined) {
      setResources(prev => ({
        gold: Math.max(0, prev.gold + (delta.gold || 0)),
        followers: Math.max(0, prev.followers + (delta.followers || 0))
      }));
    }

    setStats(prev => {
      const next = { ...prev };
      if (delta.piety !== undefined) next.piety = Math.max(0, next.piety + delta.piety);
      if (delta.renown !== undefined) next.renown = Math.max(0, next.renown + delta.renown);
      if (delta.divinity !== undefined) next.divinity = Math.max(0, Math.min(100, next.divinity + delta.divinity));
      if (delta.corruption !== undefined) next.corruption = Math.max(0, Math.min(100, next.corruption + delta.corruption));
      return next;
    });
  }, []);

  const unlockSkill = useCallback((skillId: string) => {
    setUnlockedSkills(prev => prev.includes(skillId) ? prev : [...prev, skillId]);
  }, []);

  const startCooldown = useCallback((abilityId: string, days: number) => {
    setAbilityCooldowns(prev => ({ ...prev, [abilityId]: days }));
  }, []);

  const tickCooldowns = useCallback(() => {
    setAbilityCooldowns(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = Math.max(0, next[id] - 1);
        if (next[id] === 0) delete next[id];
      });
      return next;
    });
  }, []);

  const makeDecision = useCallback((decisionId: string) => {
    console.log(`Herald making decision: ${decisionId}`);
  }, []);

  return {
    stats,
    computedStats,
    traitIds,
    traits: traitIds.map(id => TRAITS[id]).filter(Boolean),
    unlockedSkills,
    abilityCooldowns,
    addTrait,
    removeTrait,
    setStat,
    updateResources,
    unlockSkill,
    startCooldown,
    tickCooldowns,
    makeDecision,
    playerResources: {
      gold: resources.gold,
      followers: resources.followers,
      prestige: computedStats.renown, // Map prestige to renown for now
      piety: computedStats.piety,
      renown: computedStats.renown
    }
  };
}
