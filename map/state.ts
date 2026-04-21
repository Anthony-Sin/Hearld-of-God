import { useState, useCallback, useMemo } from 'react';
import { generateMap, MapData } from './mapGenerator';
import { MapMode, LODLevel } from './types';

export function useMapState(initialSeed: number, width: number, depth: number) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [currentSeed, setCurrentSeed] = useState(initialSeed);
  const [mapMode, setMapMode] = useState<MapMode>('political');
  const [lodLevel, setLodLevel] = useState<LODLevel>('empire');

  const mapData = useMemo(() => {
    return generateMap(width, depth, currentSeed);
  }, [currentSeed, width, depth]);

  const selectedProvince = useMemo(() => {
    if (selectedProvinceId === null) return null;
    return mapData.baronies.find(b => b.id === selectedProvinceId) || null;
  }, [selectedProvinceId, mapData]);

  const regenerateMap = useCallback((newSeed?: number) => {
    setIsGenerating(true);
    const seedToUse = newSeed !== undefined ? newSeed : Math.floor(Math.random() * 1000000);
    setCurrentSeed(seedToUse);
    setSelectedProvinceId(null);
    setIsGenerating(false);
  }, []);

  return {
    mapData,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    isGenerating,
    setIsGenerating,
    regenerateMap,
    currentSeed,
    mapMode,
    setMapMode,
    lodLevel,
    setLodLevel
  };
}
