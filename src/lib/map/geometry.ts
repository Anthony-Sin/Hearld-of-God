/**
 * Centroid Calculation & Orientation Logic for map entities.
 */

export interface GeometryMetadata {
    x: number;
    z: number;
    rotation: number;
    area: number;
}

export const calculateEntityGeometry = (voxList: { x: number, z: number }[] | undefined): GeometryMetadata => {
    if (!voxList || voxList.length === 0) return { x: 0, z: 0, rotation: 0, area: 0 };
    
    // Find the largest contiguous cluster (Main Island) using a simple queue-based flood fill
    const clusters: {x:number, z:number}[][] = [];
    const visited = new Set<string>();
    
    voxList.forEach(v => {
        const key = `${v.x},${v.z}`;
        if (visited.has(key)) return;
        
        const cluster: {x:number, z:number}[] = [];
        const queue = [v];
        visited.add(key);
        
        while(queue.length > 0) {
            const curr = queue.shift()!;
            cluster.push(curr);
            
            [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx, dz]) => {
                const nx = curr.x + dx;
                const nz = curr.z + dz;
                const nKey = `${nx},${nz}`;
                if (!visited.has(nKey) && voxList.some(bv => bv.x === nx && bv.z === nz)) {
                    visited.add(nKey);
                    queue.push({x: nx, z: nz});
                }
            });
        }
        clusters.push(cluster);
    });

    clusters.sort((a, b) => b.length - a.length);
    const mainMass = clusters[0] || voxList;

    // Weighted Centroid
    const sum = mainMass.reduce((acc, v) => ({ x: acc.x + v.x, z: acc.z + v.z }), { x: 0, z: 0 });
    const cx = sum.x / mainMass.length;
    const cz = sum.z / mainMass.length;

    // Nearest land voxel to centroid in main mass for labeling anchor
    let nearest = mainMass[0];
    let minDist = Infinity;
    mainMass.forEach(v => {
      const d = (v.x - cx)**2 + (v.z - cz)**2;
      if (d < minDist) { minDist = d; nearest = v; }
    });

    // PCA (Principal Component Analysis) for territory orientation
    let m11 = 0, m12 = 0, m22 = 0;
    mainMass.forEach(v => {
      const dx = v.x - cx;
      const dz = v.z - cz;
      m11 += dx * dx;
      m12 += dx * dz;
      m22 += dz * dz;
    });
    const rotation = 0.5 * Math.atan2(2 * m12, m11 - m22);

    return { x: nearest.x, z: nearest.z, rotation, area: voxList.length };
};

export const processTerritoryCenters = (entityMap: Record<number, any>, voxelsByEntity: Record<number, {x:number, z:number}[]>) => {
    Object.keys(entityMap).forEach(idKey => {
      const id = parseInt(idKey);
      const res = calculateEntityGeometry(voxelsByEntity[id]);
      entityMap[id].x = res.x;
      entityMap[id].z = res.z;
      entityMap[id].rotation = res.rotation;
      entityMap[id].area = res.area;
    });
};
