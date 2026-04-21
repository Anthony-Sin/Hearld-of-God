import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MapData, ViewLevel } from './types';
import { createLabelMesh, updateLabelsCollision } from './labelUtils';

export function useVoxelLabels(scene: THREE.Scene | null, mapData: MapData, viewLevel: ViewLevel) {
    const labelGroupRef = useRef<THREE.Group | null>(null);

    // Initial Create
    useEffect(() => {
        if (!scene || !mapData) return;

        if (labelGroupRef.current) {
            scene.remove(labelGroupRef.current);
            labelGroupRef.current.children.forEach(c => {
                if (c instanceof THREE.Mesh) {
                    (c.material as THREE.MeshBasicMaterial).map?.dispose();
                    (c.material as THREE.MeshBasicMaterial).dispose();
                }
            });
        }

        const group = new THREE.Group();
        labelGroupRef.current = group;

        // Helper to find the best placement for an entity (centroid of land voxels and max height)
        const getEntityPlacement = (id: number, level: ViewLevel) => {
            const memberBaronies = mapData.baronies.filter(b => {
                if (level === 'Empire') return b.empireId === id;
                if (level === 'Kingdom') return b.kingdomId === id;
                if (level === 'Duchy') return b.duchyId === id;
                if (level === 'County') return b.id === id; // Wait, HierarchyEntity counties vs BaronyData
                return false;
            });

            // Special case for County as it might be HierarchyEntity or Barony
            let targetBaronies = memberBaronies;
            if (level === 'County' && mapData.counties[id]) {
                 targetBaronies = mapData.baronies.filter(b => b.countyId === id);
            }

            if (targetBaronies.length === 0) return null;

            let sumX = 0, sumZ = 0, count = 0;
            let maxHeight = 0;
            let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

            targetBaronies.forEach(b => {
                // Approximate land area using barony seed as proxy, or scan voxels for accuracy
                // For performance, let's use the barony seeds that are already on land
                sumX += b.x;
                sumZ += b.z;
                count++;

                // Scan voxels of this barony to find max height and land bounds
                // Optimization: scan every Nth voxel if too many
                const baronyVoxels = mapData.voxels.filter(v => v.provinceId === b.id);
                baronyVoxels.forEach(v => {
                    if (v.type !== 'water' && v.type !== 'deep_water') {
                        maxHeight = Math.max(maxHeight, v.height);
                        minX = Math.min(minX, v.x);
                        maxX = Math.max(maxX, v.x);
                        minZ = Math.min(minZ, v.z);
                        maxZ = Math.max(maxZ, v.z);
                    }
                });
            });

            if (count === 0 || minX === Infinity) return null;

            const centerX = sumX / count;
            const centerZ = sumZ / count;

            const width = maxX - minX;
            const depth = maxZ - minZ;

            return { x: centerX, z: centerZ, maxHeight, width, depth };
        };

        // Add labels for all levels, we'll toggle visibility
        const addTier = (entities: any[], level: ViewLevel) => {
            entities.forEach(e => {
                const placement = getEntityPlacement(e.id, level);
                if (!placement) return;

                // Check if we should rotate vertically
                // If the landmass is much taller than wide
                const isVertical = placement.depth > placement.width * 1.5;

                // Constrain scale if it's too big for the landmass
                // createLabelMesh uses area for base scale, let's refine
                const mesh = createLabelMesh(
                    e.name,
                    level,
                    e.id,
                    placement.x,
                    placement.z,
                    e.rotation || 0,
                    placement.maxHeight,
                    '#ffffff',
                    e.area || 100,
                    isVertical
                );
                group.add(mesh);
            });
        };

        addTier(Object.values(mapData.empires), 'Empire');
        addTier(Object.values(mapData.kingdoms), 'Kingdom');
        addTier(Object.values(mapData.duchies), 'Duchy');
        addTier(Object.values(mapData.counties), 'County');

        scene.add(group);

        return () => {
            if (labelGroupRef.current) {
                scene.remove(labelGroupRef.current);
            }
        };
    }, [scene, mapData]);

    // Visibility & Collision Update
    const updateLabels = useCallback((camera: THREE.Camera, controls: any) => {
        if (!labelGroupRef.current) return;
        updateLabelsCollision(labelGroupRef.current, viewLevel, camera, controls);
    }, [viewLevel]);

    return { updateLabels, labelGroupRef };
}
