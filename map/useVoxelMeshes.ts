import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MapData } from './types';
import { ViewLevel } from './types';

const LAND_BASE_COLOR = new THREE.Color('#a1c181');
const MOUNTAIN_COLOR = new THREE.Color('#8b8c89');
const HILL_COLOR = new THREE.Color('#728c5a');
const RIVER_COLOR = new THREE.Color('#5ea5c7');
const FOREST_COLOR = new THREE.Color('#2d4c1e');
const SNOW_COLOR = new THREE.Color('#f0f4f5');
const SAND_COLOR = new THREE.Color('#e3c28a');
const SWAMP_COLOR = new THREE.Color('#3d4d2d');
const WASTELAND_COLOR = new THREE.Color('#8a7a6a');
const TUNDRA_COLOR = new THREE.Color('#adc2b2');

export function useVoxelMeshes(mapData: MapData) {
    const landInstRef = useRef<THREE.InstancedMesh | null>(null);
    const waterInstRef = useRef<THREE.InstancedMesh | null>(null);

    const updateColors = useCallback((viewLevel: ViewLevel, showRegions: boolean) => {
        const landInst = landInstRef.current;
        if (!landInst) return;

        const tempColor = new THREE.Color();
        let landIdx = 0;

        mapData.voxels.forEach(v => {
            if (v.type === 'water' || v.type === 'deep_water') return;

            // Base Terrain Color
            let baseColor = LAND_BASE_COLOR;
            if (v.type === 'mountain') baseColor = MOUNTAIN_COLOR;
            if (v.type === 'hill') baseColor = HILL_COLOR;
            if (v.type === 'river') baseColor = RIVER_COLOR;
            if (v.type === 'forest') baseColor = FOREST_COLOR;
            if (v.type === 'snow') baseColor = SNOW_COLOR;
            if (v.type === 'sand') baseColor = SAND_COLOR;
            if (v.type === 'swamp') baseColor = SWAMP_COLOR;
            if (v.type === 'wasteland') baseColor = WASTELAND_COLOR;
            if (v.type === 'tundra') baseColor = TUNDRA_COLOR;

            // Region Overlay Color Logic
            let regionColor: string | null = null;
            const barony = mapData.baronies[v.provinceId];
            if (showRegions && barony) {
                if (viewLevel === 'Empire') regionColor = mapData.empires[barony.empireId]?.color;
                else if (viewLevel === 'Kingdom') regionColor = mapData.kingdoms[barony.kingdomId]?.color;
                else if (viewLevel === 'Duchy') regionColor = mapData.duchies[barony.duchyId]?.color;
                else if (viewLevel === 'County') regionColor = mapData.counties[barony.countyId]?.color;
            }

            if (regionColor) {
                tempColor.set(regionColor).lerp(baseColor, 0.3);
            } else {
                tempColor.copy(baseColor);
            }

            for (let h = 0; h < v.height; h++) {
                landInst.setColorAt(landIdx, tempColor);
                landIdx++;
            }
        });

        landInst.instanceColor!.needsUpdate = true;
    }, [mapData]);

    return { landInstRef, waterInstRef, updateColors };
}
