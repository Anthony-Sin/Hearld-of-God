import { useCallback } from 'react';
import * as THREE from 'three';
import { MapData } from './types';

export function useVoxelPicking(
    camera: THREE.PerspectiveCamera | null,
    landInst: THREE.InstancedMesh | null,
    mapData: MapData,
    onSelect: (id: number | null) => void
) {
    const handlePick = useCallback((event: MouseEvent, container: HTMLElement) => {
        if (!camera || !landInst || !container) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(landInst);

        if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId;
            if (instanceId !== undefined) {
                // Find voxel index from instanceId
                // Note: The mapping logic here depends on how landInst was populated
                // In our case, we calculate landIdx sequentially corresponding to v.height
                let currentLandIdx = 0;
                let foundVoxelIdx = -1;
                
                for (let i = 0; i < mapData.voxels.length; i++) {
                    const v = mapData.voxels[i];
                    if (v.type !== 'water') {
                        if (instanceId >= currentLandIdx && instanceId < currentLandIdx + v.height) {
                            foundVoxelIdx = i;
                            break;
                        }
                        currentLandIdx += v.height;
                    }
                }

                if (foundVoxelIdx !== -1) {
                    const voxel = mapData.voxels[foundVoxelIdx];
                    onSelect(voxel.provinceId);
                }
            }
        } else {
            // Check if we clicked on background to deselect
            onSelect(null);
        }
    }, [camera, landInst, mapData, onSelect]);

    return { handlePick };
}
