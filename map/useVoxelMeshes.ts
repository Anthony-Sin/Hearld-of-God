import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MapData, MapMode, LODLevel } from './types';
import { ViewLevel } from './types';

function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function getCultureColor(culture: string) {
    const hash = hashString(culture);
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 50%)`;
}

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

    const updateColors = useCallback((mapMode: MapMode, lodLevel: LODLevel) => {
        const landInst = landInstRef.current;
        if (!landInst) return;

        const tempColor = new THREE.Color();
        let landIdx = 0;

        mapData.voxels.forEach(v => {
            if (v.type === 'water' || v.type === 'deep_water' || v.height === 0) return;

            // 1. Determine Base Color based on Map Mode
            if (mapMode === 'terrain') {
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
                tempColor.copy(baseColor);
            } else if (mapMode === 'political') {
                const barony = mapData.baronies[v.provinceId];
                if (barony) {
                    let colorHex: string;
                    if (lodLevel === 'empire') colorHex = mapData.empires[barony.empireId]?.color;
                    else if (lodLevel === 'duchy') colorHex = mapData.duchies[barony.duchyId]?.color;
                    else if (lodLevel === 'county') colorHex = mapData.counties[barony.countyId]?.color;
                    else colorHex = barony.color;

                    tempColor.set(colorHex);
                } else {
                    tempColor.set(LAND_BASE_COLOR);
                }
            } else if (mapMode === 'culture') {
                const barony = mapData.baronies[v.provinceId];
                if (barony) {
                    tempColor.set(getCultureColor(barony.culture));
                } else {
                    tempColor.set(LAND_BASE_COLOR);
                }
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
