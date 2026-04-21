import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import { MapData } from './types';

const TABLE_COLOR = new THREE.Color('#1a1a1a');
const WATER_COLOR = new THREE.Color('#2b5c7a');
const DEEP_WATER_COLOR = new THREE.Color('#1a3a4a');
const LAND_BASE_COLOR = new THREE.Color('#a1c181');
const MOUNTAIN_COLOR = new THREE.Color('#8b8c89');
const HILL_COLOR = new THREE.Color('#728c5a');
const RIVER_COLOR = new THREE.Color('#5ea5c7');
const FOREST_COLOR = new THREE.Color('#2d4c1e');
const SNOW_COLOR = new THREE.Color('#f0f4f5');
const SAND_COLOR = new THREE.Color('#e3c28a');
const SWAMP_COLOR = new THREE.Color('#3d4d2d');
const WASTELAND_COLOR = new THREE.Color('#8a7a6a');
const TUNDRA_COLOR = new THREE.Color('#adc2b2');

export function useVoxelScene(
    scene: THREE.Scene | null,
    mapData: MapData,
    landInstRef: MutableRefObject<THREE.InstancedMesh | null>,
    waterInstRef: MutableRefObject<THREE.InstancedMesh | null>,
    instanceToProvinceRef: MutableRefObject<Int32Array | null>,
    viewLevel: string
) {
    const cloudGroupRef = useRef<THREE.Group | null>(null);

    // Toggle clouds based on viewLevel
    useEffect(() => {
        if (cloudGroupRef.current) {
            cloudGroupRef.current.visible = (viewLevel === 'Empire');
        }
    }, [viewLevel]);

    useEffect(() => {
        if (!scene || !mapData) return;

        // Cleanup
        scene.clear();

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
        dirLight.position.set(-mapData.width, mapData.width * 2, mapData.depth);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.set(2048, 2048);
        dirLight.shadow.camera.left = -mapData.width;
        dirLight.shadow.camera.right = mapData.width;
        dirLight.shadow.camera.top = mapData.depth;
        dirLight.shadow.camera.bottom = -mapData.depth;
        scene.add(dirLight);

        // Ground/Table
        const tableGeo = new THREE.PlaneGeometry(mapData.width * 10, mapData.depth * 10);
        const tableMat = new THREE.MeshStandardMaterial({ color: TABLE_COLOR, roughness: 0.95 });
        const table = new THREE.Mesh(tableGeo, tableMat);
        table.rotation.x = -Math.PI / 2;
        table.position.y = -0.55;
        table.receiveShadow = true;
        scene.add(table);

        // Core Voxel Instances
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const landVoxCount = mapData.voxels.filter(v => v.type !== 'water' && v.type !== 'deep_water').reduce((acc, v) => acc + v.height, 0);
        const waterVoxels = mapData.voxels.filter(v => v.type === 'water' || v.type === 'deep_water');
        const waterVoxCount = waterVoxels.length;

        const landMat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05 });
        const landInst = new THREE.InstancedMesh(boxGeo, landMat, landVoxCount);
        landInst.castShadow = true;
        landInst.receiveShadow = true;
        landInstRef.current = landInst;

        const waterMat = new THREE.MeshStandardMaterial({ 
            roughness: 0.2, 
            metalness: 0.3,
            transparent: true, 
            opacity: 0.75 
        });
        const waterInst = new THREE.InstancedMesh(boxGeo, waterMat, waterVoxCount);
        waterInst.receiveShadow = true;
        waterInstRef.current = waterInst;

        const tempMatrix = new THREE.Matrix4();
        const tempColor = new THREE.Color();
        let landIdx = 0;
        let waterIdx = 0;
        const iToP = new Int32Array(landVoxCount);
        instanceToProvinceRef.current = iToP;

        mapData.voxels.forEach(v => {
            if (v.type === 'water' || v.type === 'deep_water') {
                tempMatrix.setPosition(v.x, v.type === 'deep_water' ? -0.5 : -0.3, v.z);
                waterInst.setMatrixAt(waterIdx, tempMatrix);
                waterInst.setColorAt(waterIdx, v.type === 'deep_water' ? DEEP_WATER_COLOR : WATER_COLOR);
                waterIdx++;
            } else {
                const barony = mapData.baronies[v.provinceId];
                const pColor = new THREE.Color(barony?.color || '#ffffff');
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
                
                tempColor.copy(baseColor).lerp(pColor, 0.4);

                for (let h = 0; h < v.height; h++) {
                    tempMatrix.setPosition(v.x, h, v.z);
                    landInst.setMatrixAt(landIdx, tempMatrix);
                    landInst.setColorAt(landIdx, tempColor);
                    iToP[landIdx] = v.provinceId;
                    landIdx++;
                }
            }
        });

        scene.add(landInst);
        scene.add(waterInst);

        // Decor (Trees & Castles)
        const forestVoxels = mapData.voxels.filter(v => v.type === 'forest');
        const treeMat = new THREE.MeshStandardMaterial({ roughness: 1.0 });
        const treeInst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), treeMat, forestVoxels.length);
        treeInst.castShadow = true;
        treeInst.receiveShadow = true;
        
        let treeIdx = 0;
        forestVoxels.forEach((v, i) => {
            // Variation in scale and color
            const scale = 0.7 + (Math.sin(i * 123.45) * 0.3);
            const colorShift = (Math.sin(i * 543.21) * 0.05);
            tempMatrix.makeScale(scale, scale, scale);
            tempMatrix.setPosition(v.x, v.height - 0.2 + (scale * 0.4), v.z); 
            treeInst.setMatrixAt(treeIdx, tempMatrix);
            
            tempColor.copy(FOREST_COLOR).multiplyScalar(0.7 + colorShift);
            treeInst.setColorAt(treeIdx, tempColor);
            treeIdx++;
        });
        scene.add(treeInst);

        // --- FANTASY SETTLEMENTS (Citadels, Keeps & Hamlets) ---
        // Hierarchy: Kingdom (Citadel), Duchy (Keep), County (Hamlet)
        const kingdomSeats = Object.values(mapData.kingdoms);
        const duchySeats = Object.values(mapData.duchies);
        const countySeats = Object.values(mapData.counties);

        // Materials
        const stoneMat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.6 }); // Light stone for Kingdom
        const darkStoneMat = new THREE.MeshStandardMaterial({ color: '#7a7a7a', roughness: 0.8 }); // Grey stone for Duchy
        const roofMat = new THREE.MeshStandardMaterial({ color: '#4a1a1a', roughness: 0.5 }); // Dark red/burgundy
        const woodMat = new THREE.MeshStandardMaterial({ color: '#5d4037', roughness: 0.9 }); // Dark wood
        const thatchMat = new THREE.MeshStandardMaterial({ color: '#c0a080', roughness: 1.0 }); // Straw/Thatch

        // Helper: Place a High Fantasy Kingdom Citadel
        const placeCitadel = (x: number, z: number, h: number) => {
            const group = new THREE.Group();
            
            // 1. Tiered Foundations (concentric squares)
            const baseGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
            const base = new THREE.Mesh(baseGeo, stoneMat);
            base.position.set(x, h + 0.1, z);
            base.castShadow = true;
            group.add(base);

            const midGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
            const mid = new THREE.Mesh(midGeo, stoneMat);
            mid.position.set(x, h + 0.5, z);
            mid.castShadow = true;
            group.add(mid);

            // 2. Grand Central Spire
            const towerGeo = new THREE.BoxGeometry(0.3, 1.8, 0.3);
            const tower = new THREE.Mesh(towerGeo, stoneMat);
            tower.position.set(x, h + 1.2, z);
            tower.castShadow = true;
            group.add(tower);

            // 3. Conical Roof
            const roofGeo = new THREE.ConeGeometry(0.25, 0.6, 4); // Square-based cone
            const roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.set(x, h + 2.4, z);
            roof.rotation.y = Math.PI / 4;
            group.add(roof);

            // 4. Smaller corner towers
            const cornerOff = 0.45;
            const sTowerGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
            [[-1,-1], [1,-1], [-1,1], [1,1]].forEach(([ox, oz]) => {
                const st = new THREE.Mesh(sTowerGeo, stoneMat);
                st.position.set(x + ox * cornerOff, h + 0.5, z + oz * cornerOff);
                st.castShadow = true;
                group.add(st);
            });

            scene.add(group);
        };

        // Helper: Place a Sturdy Duchy Keep
        const placeKeep = (x: number, z: number, h: number) => {
            const group = new THREE.Group();
            
            // Main square keep
            const keepGeo = new THREE.BoxGeometry(0.7, 0.9, 0.7);
            const keep = new THREE.Mesh(keepGeo, darkStoneMat);
            keep.position.set(x, h + 0.35, z);
            keep.castShadow = true;
            group.add(keep);

            // Battlement top (slightly wider rim)
            const rimGeo = new THREE.BoxGeometry(0.8, 0.15, 0.8);
            const rim = new THREE.Mesh(rimGeo, darkStoneMat);
            rim.position.set(x, h + 0.85, z);
            group.add(rim);

            // Central lookout
            const lookoutGeo = new THREE.BoxGeometry(0.35, 0.4, 0.35);
            const lookout = new THREE.Mesh(lookoutGeo, darkStoneMat);
            lookout.position.set(x, h + 1.1, z);
            group.add(lookout);

            // Steep roof
            const roofGeo = new THREE.ConeGeometry(0.3, 0.4, 4);
            const roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.set(x, h + 1.5, z);
            roof.rotation.y = Math.PI / 4;
            group.add(roof);

            scene.add(group);
        };

        // Helper: Place a Cozy County Hamlet
        const placeHamlet = (x: number, z: number, h: number, seed: number) => {
            const group = new THREE.Group();
            const houseCount = 3 + (seed % 3);
            
            for (let i = 0; i < houseCount; i++) {
                const offX = (Math.sin(seed + i * 1.5) * 0.4);
                const offZ = (Math.cos(seed + i * 1.5) * 0.4);
                
                const houseGeo = new THREE.BoxGeometry(0.25, 0.2, 0.18);
                const house = new THREE.Mesh(houseGeo, woodMat);
                house.position.set(x + offX, h - 0.4, z + offZ);
                house.rotation.y = (seed + i) * 123;
                house.castShadow = true;
                group.add(house);

                const houseRoofGeo = new THREE.ConeGeometry(0.2, 0.2, 4);
                const roof = new THREE.Mesh(houseRoofGeo, thatchMat);
                roof.position.set(x + offX, h - 0.25, z + offZ);
                roof.rotation.y = house.rotation.y + Math.PI / 4;
                group.add(roof);
            }
            scene.add(group);
        };

        // Execution: Distribute settlements based on hierarchy
        kingdomSeats.forEach(k => {
            const ix = Math.min(mapData.width - 1, Math.max(0, Math.round(k.x)));
            const iz = Math.min(mapData.depth - 1, Math.max(0, Math.round(k.z)));
            const voxel = mapData.voxels[iz * mapData.width + ix];
            const h = voxel ? voxel.height : 1;
            placeCitadel(k.x, k.z, h);
        });

        duchySeats.forEach(d => {
            const ix = Math.min(mapData.width - 1, Math.max(0, Math.round(d.x)));
            const iz = Math.min(mapData.depth - 1, Math.max(0, Math.round(d.z)));
            const voxel = mapData.voxels[iz * mapData.width + ix];
            const h = voxel ? voxel.height : 1;
            placeKeep(d.x, d.z, h);
        });

        countySeats.forEach((c, idx) => {
            if (idx % 3 !== 0) return; // Even MORE selective: 33% of counties have villages
            const ix = Math.min(mapData.width - 1, Math.max(0, Math.round(c.x)));
            const iz = Math.min(mapData.depth - 1, Math.max(0, Math.round(c.z)));
            const voxel = mapData.voxels[iz * mapData.width + ix];
            const h = voxel ? voxel.height : 1;
            placeHamlet(c.x, c.z, h, idx);
        });

        // Cloud layer
        const cloudGroup = new THREE.Group();
        cloudGroupRef.current = cloudGroup;
        const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.4, roughness: 1.0 });
        const cloudGeo = new THREE.SphereGeometry(2, 4, 4);
        for (let i = 0; i < 30; i++) {
            const cloud = new THREE.Mesh(cloudGeo, cloudMat);
            cloud.position.set(
                Math.random() * mapData.width,
                15 + Math.random() * 5,
                Math.random() * mapData.depth
            );
            cloud.scale.set(1 + Math.random() * 3, 0.5, 1 + Math.random() * 2);
            cloudGroup.add(cloud);
        }
        scene.add(cloudGroup);

    }, [scene, mapData]);

    // Animate clouds
    useEffect(() => {
        let frame: number;
        const animate = () => {
            if (cloudGroupRef.current) {
                cloudGroupRef.current.children.forEach(c => {
                    c.position.x += 0.01;
                    if (c.position.x > mapData.width) c.position.x = 0;
                });
            }
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, [mapData.width]);
}
