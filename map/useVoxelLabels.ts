import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { MapData, ViewLevel } from './types';
import { createLabelMesh } from './labelUtils';

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
                    0,
                    voxel?.height || 1,
                    '#ffffff',
                    100 // Area placeholder
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

    // Visibility Update
    const updateLabels = useCallback(() => {
        if (!labelGroupRef.current) return;
        labelGroupRef.current.children.forEach(child => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            if (mesh.userData.level === viewLevel) {
                mesh.visible = true;
                mat.opacity = 1;
            } else {
                mesh.visible = false;
                mat.opacity = 0;
            }
        });
    }, [viewLevel]);

    return { updateLabels, labelGroupRef };
}
