import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapData, LODLevel } from './types';

export function useBorders(scene: THREE.Scene | null, mapData: MapData, lodLevel: LODLevel) {
    const bordersGroupRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!scene || !mapData) return;

        if (bordersGroupRef.current) {
            scene.remove(bordersGroupRef.current);
            bordersGroupRef.current.children.forEach(c => {
                if (c instanceof THREE.LineSegments) {
                    c.geometry.dispose();
                    (c.material as THREE.Material).dispose();
                }
            });
        }

        const group = new THREE.Group();
        bordersGroupRef.current = group;

        // Helper to find edges
        const findEdges = (getLevelId: (baronyId: number) => number) => {
            const edges: number[] = [];
            const width = mapData.width;
            const depth = mapData.depth;

            // We iterate over voxels and check neighbors
            for (let z = 0; z < depth; z++) {
                for (let x = 0; x < width; x++) {
                    const idx = z * width + x;
                    const v = mapData.voxels[idx];
                    if (v.provinceId === -1) continue;

                    const currentLevelId = getLevelId(v.provinceId);

                    // Check right and bottom neighbors
                    const neighbors = [
                        { nx: x + 1, nz: z, x1: x + 0.5, z1: z - 0.5, x2: x + 0.5, z2: z + 0.5 },
                        { nx: x, nz: z + 1, x1: x - 0.5, z1: z + 0.5, x2: x + 0.5, z2: z + 0.5 }
                    ];

                    neighbors.forEach(n => {
                        if (n.nx >= 0 && n.nx < width && n.nz >= 0 && n.nz < depth) {
                            const nIdx = n.nz * width + n.nx;
                            const nv = mapData.voxels[nIdx];
                            const nLevelId = nv.provinceId !== -1 ? getLevelId(nv.provinceId) : -1;

                            if (currentLevelId !== nLevelId) {
                                // Add edge line
                                const h = Math.max(v.height, nv.height) + 0.1;
                                edges.push(n.x1, h, n.z1, n.x2, h, n.z2);
                            }
                        }
                    });
                }
            }
            return edges;
        };

        const createBorderMesh = (edges: number[], color: string, linewidth: number, opacity: number, glow = false) => {
            if (edges.length === 0) return null;
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color(color),
                transparent: true,
                opacity: opacity,
                linewidth: linewidth
            });
            const line = new THREE.LineSegments(geometry, material);
            if (glow) {
                // Simplified glow: just add another thicker line with lower opacity
                const glowMat = new THREE.LineBasicMaterial({
                    color: new THREE.Color(color),
                    transparent: true,
                    opacity: opacity * 0.5,
                    depthWrite: false
                });
                const glowLine = new THREE.LineSegments(geometry, glowMat);
                glowLine.scale.set(1, 1.05, 1);
                group.add(glowLine);
            }
            return line;
        };

        // Barony Borders (Thin)
        const baronyEdges = findEdges(id => id);
        const baronyBorders = createBorderMesh(baronyEdges, '#ffffff', 1, 0.1);
        if (baronyBorders) {
            baronyBorders.name = 'barony_borders';
            group.add(baronyBorders);
        }

        // County Borders (Medium)
        const countyEdges = findEdges(id => mapData.baronies[id]?.countyId);
        const countyBorders = createBorderMesh(countyEdges, '#ffffff', 2, 0.3);
        if (countyBorders) {
            countyBorders.name = 'county_borders';
            group.add(countyBorders);
        }

        // Duchy + Kingdom + Empire Borders (Thick Glowing)
        const empireEdges = findEdges(id => mapData.baronies[id]?.empireId);
        const empireBorders = createBorderMesh(empireEdges, '#ffcc00', 3, 0.8, true);
        if (empireBorders) {
            empireBorders.name = 'empire_borders';
            group.add(empireBorders);
        }

        scene.add(group);

        return () => {
            if (bordersGroupRef.current) scene.remove(bordersGroupRef.current);
        };
    }, [scene, mapData]);

    // LOD Based Visibility
    useEffect(() => {
        if (!bordersGroupRef.current) return;

        const group = bordersGroupRef.current;
        const barony = group.getObjectByName('barony_borders');
        const county = group.getObjectByName('county_borders');
        const empire = group.getObjectByName('empire_borders');

        if (barony) barony.visible = (lodLevel === 'barony');
        if (county) county.visible = (lodLevel === 'barony' || lodLevel === 'county');
        // Empire and its glow are always visible
    }, [lodLevel]);

    return { bordersGroupRef };
}
