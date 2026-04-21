import { useState, useCallback, useEffect, useMemo } from 'react';
import { generateMap, MapData, BaronyData } from '../lib/mapGenerator';

export interface GameResources {
  gold: number;
  prestige: number;
  piety: number;
  renown: number;
}

export function useGameState() {
  const [isStarted, setIsStarted] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000));
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [gameSpeed, setGameSpeed] = useState(0); 
  const [currentDate, setCurrentDate] = useState(new Date(1066, 0, 1)); 
  
  const [playerResources, setPlayerResources] = useState<GameResources>({
    gold: 240,
    prestige: 150,
    piety: 80,
    renown: 20
  });

  const mapData = useMemo(() => {
    return generateMap(120, 80, seed);
  }, [seed]);

  const selectedProvince = useMemo(() => {
    if (selectedProvinceId === null) return null;
    // selectedProvinceId refers to Barony ID
    return mapData.baronies.find(b => b.id === selectedProvinceId) || null;
  }, [selectedProvinceId, mapData]);

  const startGame = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1000000));
    setIsStarted(true);
    setGameSpeed(1);
  }, []);

  const regenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setSeed(Math.floor(Math.random() * 1000000));
      setSelectedProvinceId(null);
      setIsGenerating(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (gameSpeed === 0) return;
    const intervalTime = 1000 / gameSpeed;
    const interval = setInterval(() => {
      setCurrentDate(prev => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 1);
        return next;
      });
      setPlayerResources(prev => ({
        gold: +(prev.gold + 0.1).toFixed(1),
        prestige: +(prev.prestige + 0.05).toFixed(2),
        piety: +(prev.piety + 0.02).toFixed(2),
        renown: +(prev.renown + 0.01).toFixed(3)
      }));
    }, intervalTime);
    return () => clearInterval(interval);
  }, [gameSpeed]);

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
    gameSpeed,
    setGameSpeed,
    currentDate,
    playerResources,
  };
}
