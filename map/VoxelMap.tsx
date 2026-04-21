import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MapData } from './mapGenerator.ts';
import { useCamera } from './useCamera.ts';
import { rendererPool } from '@shared/threeSingleton';
import { ViewLevel } from './types';

// Modular Hooks
import { useVoxelScene } from './useVoxelScene';
import { useVoxelLabels } from './useVoxelLabels';
import { useVoxelMeshes } from './useVoxelMeshes';
import { useVoxelPicking } from './useVoxelPicking';

interface VoxelMapProps {
  mapData: MapData;
  width: number;
  depth: number;
  onProvinceClick?: (provinceId: number) => void;
  showRegions?: boolean;
  selectedProvinceId?: number | null;
}

export default function VoxelMap({ 
    mapData, width, depth, onProvinceClick, showRegions = true, selectedProvinceId 
}: VoxelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [domElement, setDomElement] = useState<HTMLElement | null>(null);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('Empire');
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const instanceToProvinceRef = useRef<Int32Array | null>(null);
  const selectedProvinceRef = useRef<number | null | undefined>(selectedProvinceId);
  
  useEffect(() => { selectedProvinceRef.current = selectedProvinceId; }, [selectedProvinceId]);

  // 1. Scene & Camera Setup
  const { camera, controls } = useCamera({ width, depth, domElement });
  
  useEffect(() => {
    if (containerRef.current) {
        const renderer = rendererPool.getMapRenderer(containerRef.current);
        setDomElement(renderer.domElement);
        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
            sceneRef.current.background = new THREE.Color('#0a0a0f');
            sceneRef.current.fog = new THREE.FogExp2('#0a0a0f', 0.002);
        }
    }
  }, []);

  // 2. Modular Layer Hooks
  const { landInstRef, waterInstRef, updateColors } = useVoxelMeshes(mapData);
  useVoxelScene(sceneRef.current, mapData, landInstRef, waterInstRef, instanceToProvinceRef, viewLevel);
  const { updateLabels } = useVoxelLabels(sceneRef.current, mapData, viewLevel);
  const { handlePick } = useVoxelPicking(camera, landInstRef.current, mapData, (id) => {
      if (id !== null) onProvinceClick?.(id);
  });

  // 3. Animation & Global Logic Loop
  useEffect(() => {
    const renderer = rendererPool.getMapRenderer(containerRef.current!);
    if (!renderer || !camera || !controls || !sceneRef.current) return;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Update camera focus
      const targetPos = new THREE.Vector3(width / 2, 0, depth / 2);
      if (selectedProvinceRef.current !== null && selectedProvinceRef.current !== undefined) {
          const barony = mapData.baronies[selectedProvinceRef.current];
          if (barony) targetPos.set(barony.x, 0, barony.z);
      }
      controls.target.lerp(targetPos, 0.08);
      controls.update();

      // Zoom level detection
      const dist = camera.position.distanceTo(controls.target);
      let level: ViewLevel = 'Empire';
      if (dist > 140) level = 'Empire';
      else if (dist > 90) level = 'Kingdom';
      else if (dist > 50) level = 'Duchy';
      else level = 'County';
      
      setViewLevel(prev => (prev !== level ? level : prev));

      // Label Collision & Visibility
      updateLabels();

      renderer.render(sceneRef.current!, camera);
    };
    animate();

    const currentDom = renderer.domElement;
    const clickHandler = (e: MouseEvent) => handlePick(e, containerRef.current!);
    currentDom.addEventListener('click', clickHandler);

    return () => {
      currentDom.removeEventListener('click', clickHandler);
      cancelAnimationFrame(animationId);
    };
  }, [mapData, camera, controls, handlePick, updateLabels, width, depth]);

  // Handle visual updates for regions
  useEffect(() => {
    updateColors(viewLevel, showRegions);
  }, [viewLevel, showRegions, updateColors]);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden bg-[#0a0a0f] relative">
      <div className="absolute top-14 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full z-30 pointer-events-none">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500/80">
          Viewing {viewLevel} Mode
        </span>
      </div>
    </div>
  );
}
