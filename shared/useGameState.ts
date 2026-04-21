import { useState, useCallback, useEffect } from 'react';
import { useMapState } from '../map/state';
import { useRulerState } from '../ruler/state';
import { useUIState } from '../ui/state';
import { MAP_WIDTH, MAP_DEPTH } from './constants';

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
    heraldStats,
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
    regenerateMap,
    mapMode,
    setMapMode,
    lodLevel,
    setLodLevel
  } = useMapState(seed, MAP_WIDTH, MAP_DEPTH);

  const {
    playerResources,
    updateResources,
    traits: rulerTraits,
    makeDecision
    stats: heraldStats,
    computedStats: computedHeraldStats,
    traits,
    makeDecision,
    setStat,
    addTrait,
    removeTrait
  } = useRulerState();

  // Combine resources with deltas (calculated based on realm size and stats)
  const extendedPlayerResources = {
    ...playerResources,
    goldDelta: Number((1.5 + mapData.baronies.length * 0.02).toFixed(1)),
    prestigeDelta: Number((2.0 + heraldStats.authority * 0.5).toFixed(1)),
    pietyDelta: Number((0.5 + heraldStats.zeal * 0.8).toFixed(1)),
    renownDelta: Number((0.2 + mapData.empires.length * 0.1).toFixed(1))
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

  // Global Tick Logic
  useEffect(() => {
    if (gameSpeed === 0) return;
    const intervalTime = 1000 / gameSpeed;
    const interval = setInterval(() => {
      advanceDate();
      updateResources({
        gold: 0.1,
        prestige: 0.05,
        piety: 0.02,
        renown: 0.01
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [gameSpeed, advanceDate, updateResources]);

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
    traits: uiTraits, // Prioritize UI traits with icons for now
    makeDecision,
    heraldInfo,
    heraldStats,
    divineBalance,
    notifications,
    blessProvince,
    investigate
    playerResources,
    heraldStats,
    computedHeraldStats,
    traits,
    activeModal,
    openModal,
    closeModal,
    makeDecision,
    setStat,
    addTrait,
    removeTrait
  };
}
