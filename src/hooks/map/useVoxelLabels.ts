import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ViewLevel, MapData, TINTS } from '../../lib/map/types';
import { LabelMesh, createLabelMesh, updateLabelsCollision } from '../../lib/map/labelUtils';

export function useVoxelLabels(
    scene: THREE.Scene | null,
    mapData: MapData,
    viewLevel: ViewLevel
) {
    const labelGroupRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!scene || !mapData) return;

        // Cleanup existing labels
        if (labelGroupRef.current) {
            labelGroupRef.current.children.forEach(child => {
                const mesh = child as THREE.Mesh;
                mesh.geometry.dispose();
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.map?.dispose();
                mat.dispose();
            });
            scene.remove(labelGroupRef.current);
        }

        const labelGroup = new THREE.Group();
        labelGroupRef.current = labelGroup;
        scene.add(labelGroup);

        const levels: ViewLevel[] = ['Empire', 'Kingdom', 'Duchy', 'County'];
        levels.forEach(level => {
            let entities: any[] = [];
            if (level === 'Empire') entities = Object.values(mapData.empires);
            else if (level === 'Kingdom') entities = Object.values(mapData.kingdoms);
            else if (level === 'Duchy') entities = Object.values(mapData.duchies);
            else entities = Object.values(mapData.counties);
            
            entities.forEach((entity: any, idx: number) => {
                if (level === 'Kingdom' && idx % 2 !== 0) return; 
                if (level === 'Duchy' && idx % 2 !== 0) return; 

                const ix = Math.min(mapData.width - 1, Math.max(0, Math.round(entity.x)));
                const iz = Math.min(mapData.depth - 1, Math.max(0, Math.round(entity.z)));
                const voxel = mapData.voxels[iz * mapData.width + ix];
                const terrainHeight = voxel ? voxel.height : 1;

                const labelMesh = createLabelMesh(
                    entity.name, 
                    level, 
                    entity.id, 
                    entity.x, 
                    entity.z, 
                    entity.rotation || 0, 
                    terrainHeight, 
                    entity.color, 
                    entity.area || 1
                );
                labelGroup.add(labelMesh);
            });
        });

        return () => {
            if (labelGroupRef.current) {
                scene.remove(labelGroupRef.current);
            }
        };
    }, [scene, mapData]);

    // Animation logic for collision and fading
    const updateLabels = () => {
        if (labelGroupRef.current) {
            updateLabelsCollision(labelGroupRef.current, viewLevel);
        }
    };

    return { labelGroupRef, updateLabels };
}
