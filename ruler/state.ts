import { useState, useCallback, useEffect } from 'react';
import { GameResources } from '../shared/types';

export interface RulerTrait {
  id: string;
  name: string;
  description: string;
  effects: Partial<GameResources>;
}

export function useRulerState() {
  const [playerResources, setPlayerResources] = useState<GameResources>({
    gold: 240,
    prestige: 150,
    piety: 80,
    renown: 20
  });

  const [traits, setTraits] = useState<RulerTrait[]>([
    { id: 'ambitious', name: 'Ambitious', description: 'Always seeking more power.', effects: { prestige: 0.1 } }
  ]);

  const updateResources = useCallback((delta: Partial<GameResources>) => {
    setPlayerResources(prev => ({
      gold: +(prev.gold + (delta.gold || 0)).toFixed(1),
      prestige: +(prev.prestige + (delta.prestige || 0)).toFixed(2),
      piety: +(prev.piety + (delta.piety || 0)).toFixed(2),
      renown: +(prev.renown + (delta.renown || 0)).toFixed(3)
    }));
  }, []);

  // Placeholder for AI behavior or decision logic
  const makeDecision = useCallback((decisionId: string) => {
    console.log(`Ruler making decision: ${decisionId}`);
  }, []);

  return {
    playerResources,
    setPlayerResources,
    updateResources,
    traits,
    makeDecision
  };
}
