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

        // Add labels for all levels, we'll toggle visibility
        const addTier = (entities: any[], level: ViewLevel) => {
            entities.forEach(e => {
                const ix = Math.min(mapData.width - 1, Math.max(0, Math.round(e.x)));
                const iz = Math.min(mapData.depth - 1, Math.max(0, Math.round(e.z)));
                const voxel = mapData.voxels[iz * mapData.width + ix];

                const mesh = createLabelMesh(
                    e.name,
                    level,
                    e.id,
                    e.x,
                    e.z,
                    e.rotation || 0,
                    voxel?.height || 1,
                    '#ffffff',
                    e.area || 100
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
    const updateLabels = useCallback(() => {
        if (!labelGroupRef.current) return;
        updateLabelsCollision(labelGroupRef.current, viewLevel);
    }, [viewLevel]);

    return { updateLabels, labelGroupRef };
}
