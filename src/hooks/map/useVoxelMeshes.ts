import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapData, ViewLevel } from '../../lib/map/types';

const LAND_BASE_COLOR = new THREE.Color('#3a4a35');
const MOUNTAIN_COLOR = new THREE.Color('#6b6b6b');
const HILL_COLOR = new THREE.Color('#4e5e48');
const RIVER_COLOR = new THREE.Color('#2d4d5d');
const FOREST_COLOR = new THREE.Color('#2a3a25');
const SNOW_COLOR = new THREE.Color('#d1d1d1');
const SAND_COLOR = new THREE.Color('#c2b280');
const SWAMP_COLOR = new THREE.Color('#3d4d2d');
const WASTELAND_COLOR = new THREE.Color('#8a7a6a');
const TUNDRA_COLOR = new THREE.Color('#adc2b2');

export function useVoxelMeshes(mapData: MapData) {
    const landInstRef = useRef<THREE.InstancedMesh | null>(null);
    const waterInstRef = useRef<THREE.InstancedMesh | null>(null);

    const updateColors = (level: ViewLevel, regions: boolean) => {
        const landInst = landInstRef.current;
        if (!landInst || !mapData) return;

        const tempColor = new THREE.Color();
        const pColor = new THREE.Color();
        let landIdx = 0;
        
        // Intensity scaling for tiers
        let opacity = 0.55;
        if (level === 'Empire') opacity = 0.45;
        else if (level === 'Kingdom') opacity = 0.55;
        else if (level === 'Duchy') opacity = 0.65;
        else if (level === 'County') opacity = 0.85;

        mapData.voxels.forEach(v => {
            if (v.type !== 'water' && v.type !== 'deep_water') {
                const barony = mapData.baronies[v.provinceId];
                let hColorStr = '#ffffff';
                if (barony) {
                    if (level === 'Empire') {
                        hColorStr = mapData.empires[barony.empireId]?.color || '#ffffff';
                    } else if (level === 'Kingdom') {
                        hColorStr = mapData.kingdoms[barony.kingdomId]?.color || '#ffffff';
                    } else if (level === 'Duchy') {
                        hColorStr = mapData.duchies[barony.duchyId]?.color || '#ffffff';
                    } else {
                        hColorStr = mapData.counties[barony.countyId]?.color || '#ffffff';
                    }
                }

                pColor.set(hColorStr);
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

                if (regions) tempColor.copy(baseColor).lerp(pColor, opacity);
                else tempColor.copy(baseColor);

                for (let h = 0; h < v.height; h++) {
                    landInst.setColorAt(landIdx++, tempColor);
                }
            }
        });
        landInst.instanceColor!.needsUpdate = true;
    };

    return { landInstRef, waterInstRef, updateColors };
}
