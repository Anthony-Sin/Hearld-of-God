import { HierarchyEntity } from './hierarchy';

export function processTerritoryCenters(entities: Record<number, HierarchyEntity>, voxelMap: Record<number, {x:number, z:number}[]>) {
    Object.keys(entities).forEach(id => {
        const voxels = voxelMap[Number(id)];
        if (voxels && voxels.length > 0) {
            const sumX = voxels.reduce((acc, v) => acc + v.x, 0);
            const sumZ = voxels.reduce((acc, v) => acc + v.z, 0);
            entities[Number(id)].x = sumX / voxels.length;
            entities[Number(id)].z = sumZ / voxels.length;
        }
    });
}
