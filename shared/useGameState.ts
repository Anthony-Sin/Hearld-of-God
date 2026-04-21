import { useState, useCallback, useEffect } from 'react';
import { useMapState } from '../map/state';
import { useRulerState } from '../ruler/state';
import { useUIState } from '../ui/state';
import { MAP_WIDTH, MAP_DEPTH } from './constants';
import { HERALD_ABILITIES } from '../ruler/skills';

export function useGameState() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000));

  const {
    isStarted,
    startGame: startUI,
    gameSpeed,
    setGameSpeed,
    currentDate,
    activeModal,
    openModal,
    closeModal,
    advanceDate,
    heraldInfo,
    divineBalance,
    traits: uiTraits,
    notifications,
    addNotification
  } = useUIState();

  const {
    mapData,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    isGenerating,
    setIsGenerating,
    mapMode,
    setMapMode,
    lodLevel,
    setLodLevel
  } = useMapState(seed, MAP_WIDTH, MAP_DEPTH);

  const {
    stats: heraldStats,
    computedStats: computedHeraldStats,
    traits,
    unlockedSkills,
    abilityCooldowns,
    makeDecision,
    setStat,
    addTrait,
    removeTrait,
    updateResources,
    unlockSkill,
    startCooldown,
    tickCooldowns,
    playerResources
  } = useRulerState();

  // Combine resources with deltas (calculated based on realm size and stats)
  const extendedPlayerResources = {
    ...playerResources,
    goldDelta: Number((1.5 + mapData.baronies.length * 0.02).toFixed(1)),
    prestigeDelta: Number((2.0 + computedHeraldStats.authority * 0.5).toFixed(1)),
    pietyDelta: Number((0.5 + computedHeraldStats.zeal * 0.8).toFixed(1)),
    renownDelta: Number((0.2 + mapData.empires.length * 0.1).toFixed(1)),
    followersDelta: Number((0.1 + computedHeraldStats.zeal * 0.2).toFixed(1))
  };

  const startGame = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    startUI();
  }, [startUI]);

  const regenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSeed = Math.floor(Math.random() * 1000000);
      setSeed(newSeed);
      setSelectedProvinceId(null);
      setIsGenerating(false);
    }, 100);
  }, [setIsGenerating, setSelectedProvinceId]);

  const blessProvince = useCallback((provinceId: number) => {
    if (playerResources.piety >= 50) {
      updateResources({ piety: -50 });
      addNotification(`Province ${provinceId} has been blessed!`, 'success');
      console.log(`Blessing province ${provinceId}`);
    } else {
      addNotification(`Not enough piety to bless province!`, 'error');
    }
  }, [playerResources.piety, updateResources, addNotification]);

  const investigate = useCallback((provinceId: number) => {
    addNotification(`Investigation launched in province ${provinceId}.`, 'info');
    console.log(`Investigating province ${provinceId}`);
  }, [addNotification]);

  const castAbility = useCallback((abilityId: string) => {
    const ability = (HERALD_ABILITIES as any)[abilityId];
    if (!ability) return;

    if (abilityCooldowns[abilityId]) {
      addNotification(`${ability.name} is on cooldown!`, 'error');
      return;
    }

    if (heraldStats.piety < ability.pietyCost) {
      addNotification(`Not enough piety for ${ability.name}!`, 'error');
      return;
    }

    if (ability.followersCost && playerResources.followers < ability.followersCost) {
      addNotification(`Not enough followers for ${ability.name}!`, 'error');
      return;
    }

    // Spend resources
    updateResources({
      piety: -ability.pietyCost,
      followers: -(ability.followersCost || 0)
    });

    // Apply effects (simplified for now)
    if (abilityId === 'shadow_harvest') {
      updateResources({ gold: 500, corruption: 10 });
    }

    startCooldown(abilityId, ability.cooldown);
    addNotification(`${ability.name} cast successfully!`, 'success');
  }, [abilityCooldowns, heraldStats.piety, playerResources.followers, updateResources, startCooldown, addNotification]);

  // Global Tick Logic
  useEffect(() => {
    if (gameSpeed === 0) return;
    const intervalTime = 1000 / gameSpeed;
    const interval = setInterval(() => {
      advanceDate();
      tickCooldowns();
      updateResources({
        gold: (extendedPlayerResources.goldDelta || 0) / 30, // Rough daily breakdown
        prestige: (extendedPlayerResources.prestigeDelta || 0) / 30,
        piety: (extendedPlayerResources.pietyDelta || 0) / 30,
        renown: (extendedPlayerResources.renownDelta || 0) / 30,
        followers: (extendedPlayerResources.followersDelta || 0) / 30
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [gameSpeed, advanceDate, updateResources, tickCooldowns, extendedPlayerResources.goldDelta, extendedPlayerResources.prestigeDelta, extendedPlayerResources.pietyDelta, extendedPlayerResources.renownDelta, extendedPlayerResources.followersDelta]);

  return {
    isStarted,
    startGame,
    seed,
    regenerate,
    isGenerating,
    mapData,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    mapMode,
    setMapMode,
    lodLevel,
    setLodLevel,
    gameSpeed,
    setGameSpeed,
    currentDate,
    playerResources: extendedPlayerResources,
    activeModal,
    openModal,
    closeModal,
    uiTraits,
    makeDecision,
    heraldInfo,
    heraldStats,
    computedHeraldStats,
    traits,
    unlockedSkills,
    abilityCooldowns,
    divineBalance,
    notifications,
    blessProvince,
    investigate,
    setStat,
    addTrait,
    removeTrait,
    unlockSkill,
    startCooldown,
    castAbility,
    updateResources
  };
}
