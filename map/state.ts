import { useState, useCallback, useMemo } from 'react';
import { generateMap, MapData } from './mapGenerator';

export function useMapState(seed: number, width: number, depth: number) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);

  const mapData = useMemo(() => {
    return generateMap(width, depth, seed);
  }, [seed, width, depth]);

  const selectedProvince = useMemo(() => {
    if (selectedProvinceId === null) return null;
    return mapData.baronies.find(b => b.id === selectedProvinceId) || null;
  }, [selectedProvinceId, mapData]);

  const regenerateMap = useCallback((newSeed: number) => {
    setIsGenerating(true);
    // In a real app, this might be async or offloaded to a worker
    setSelectedProvinceId(null);
    // Simulate generation delay if needed, but generateMap is synchronous here
    setIsGenerating(false);
  }, []);

  return {
    mapData,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    isGenerating,
    setIsGenerating,
    regenerateMap
  };
}
