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
    advanceDate
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
    traits,
    makeDecision
  } = useRulerState();

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
    playerResources,
    activeModal,
    openModal,
    closeModal,
    traits,
    makeDecision
  };
}
