import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapData } from './types';

export function useSelectionHighlight(scene: THREE.Scene | null, mapData: MapData, selectedProvinceId: number | null) {
    const highlightRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!scene || !mapData) return;

        if (highlightRef.current) {
            scene.remove(highlightRef.current);
            highlightRef.current.children.forEach(c => {
                if (c instanceof THREE.Mesh || c instanceof THREE.LineSegments) {
                    c.geometry.dispose();
                    (c.material as THREE.Material).dispose();
                }
            });
        }

        if (selectedProvinceId === null) return;

        const group = new THREE.Group();
        highlightRef.current = group;

        // Find all voxels for the selected province
        const provinceVoxels = mapData.voxels.filter(v => v.provinceId === selectedProvinceId);
        if (provinceVoxels.length === 0) return;

        // Create a flat mesh outline
        const edges: number[] = [];
        const width = mapData.width;

        provinceVoxels.forEach(v => {
            // Check 4 neighbors
            const neighbors = [
                { nx: v.x + 1, nz: v.z, x1: v.x + 0.5, z1: v.z - 0.5, x2: v.x + 0.5, z2: v.z + 0.5 },
                { nx: v.x - 1, nz: v.z, x1: v.x - 0.5, z1: v.z - 0.5, x2: v.x - 0.5, z2: v.z + 0.5 },
                { nx: v.x, nz: v.z + 1, x1: v.x - 0.5, z1: v.z + 0.5, x2: v.x + 0.5, z2: v.z + 0.5 },
                { nx: v.x, nz: v.z - 1, x1: v.x - 0.5, z1: v.z - 0.5, x2: v.x + 0.5, z2: v.z - 0.5 }
            ];

            neighbors.forEach(n => {
                const nv = mapData.voxels[n.nz * width + n.nx];
                if (!nv || nv.provinceId !== selectedProvinceId) {
                    edges.push(n.x1, v.height + 0.15, n.z1, n.x2, v.height + 0.15, n.z2);
                }
            });
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
        const material = new THREE.LineBasicMaterial({
            color: '#ffcc00',
            transparent: true,
            opacity: 1.0,
            linewidth: 3
        });
        const outline = new THREE.LineSegments(geometry, material);
        group.add(outline);

        scene.add(group);

        return () => {
            if (highlightRef.current) scene.remove(highlightRef.current);
        };
    }, [scene, mapData, selectedProvinceId]);

    // Pulsing Animation
    useEffect(() => {
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            if (highlightRef.current) {
                const time = Date.now() * 0.005;
                const opacity = 0.5 + Math.sin(time) * 0.5;
                highlightRef.current.children.forEach(c => {
                    if (c instanceof THREE.LineSegments) {
                        (c.material as THREE.LineBasicMaterial).opacity = opacity;
                    }
                });
            }
        };
        animate();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return { highlightRef };
}
