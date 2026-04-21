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
    isCreating,
    startCreation,
    cancelCreation,
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
    traitIds,
    traits,
    unlockedSkills,
    abilityCooldowns,
    makeDecision,
    setStat,
    addTrait,
    removeTrait,
    updateResources,
    unlockSkill,
    initializeHerald,
    startCooldown,
    tickCooldowns,
    playerResources
  } = useRulerState();

  // Combine resources with deltas (calculated based on realm size and stats)
  const extendedPlayerResources = {
    ...playerResources,
    // Money is now primarily from donations (Followers * Rate)
    goldDelta: Number((playerResources.followers * (0.05 + (computedHeraldStats.zeal * 0.01) + (computedHeraldStats.authority * 0.005))).toFixed(1)),
    prestigeDelta: Number((1.0 + computedHeraldStats.authority * 0.2).toFixed(1)),
    pietyDelta: Number((2.0 + computedHeraldStats.zeal * 0.4).toFixed(1)),
    renownDelta: Number((0.1 + mapData.empires.length * 0.2).toFixed(1)),
    followersDelta: Number((0.5 + computedHeraldStats.zeal * 0.5).toFixed(1))
  };

  const startGame = useCallback((info: { name: string, title: string, traits: string[] }) => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    initializeHerald(info.traits);
    startUI({ name: info.name, title: info.title });
  }, [startUI, initializeHerald]);

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

  // Milestones
  useEffect(() => {
    if (!isStarted) return;

    const milestoneThresholds = [100, 500, 1000, 5000];
    milestoneThresholds.forEach(threshold => {
      // Use a simple local storage or state to track reached milestones if needed,
      // but for now we just notify when crossing the threshold.
      // This is slightly naive as it might trigger again on load,
      // but fine for a session-based game.
      if (playerResources.followers >= threshold && (playerResources.followers - (extendedPlayerResources.followersDelta || 0) / 30) < threshold) {
        addNotification(`Divine Milestone Reached: ${threshold} Followers! The heavens smile upon you.`, 'success');
        updateResources({ piety: 100, renown: 10 });
      }
    });
  }, [playerResources.followers, isStarted, addNotification, updateResources, extendedPlayerResources.followersDelta]);

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
    isCreating,
    startCreation,
    cancelCreation,
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
