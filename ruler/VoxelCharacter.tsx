import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BaronyData } from '@map/mapGenerator.ts';
import { rendererPool } from '@shared/threeSingleton';

interface VoxelCharacterProps {
  provinceData: BaronyData | null;
}

export default function VoxelCharacter({ provinceData }: VoxelCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);

  // 1. Permanent Engine Initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = rendererPool.getCharRenderer(containerRef.current);
    const width = containerRef.current.clientWidth || 200;
    const height = containerRef.current.clientHeight || 200;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(0, 26, 30); 
    camera.lookAt(0, 24, 0);
    cameraRef.current = camera;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 30, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      scene.clear();
      // We don't dispose the renderer as it's a shared singleton
    };
  }, []);

  // 2. Mesh Updates (When data changes)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (instancedMeshRef.current) {
      scene.remove(instancedMeshRef.current);
      instancedMeshRef.current.geometry.dispose();
      (instancedMeshRef.current.material as THREE.Material).dispose();
      instancedMeshRef.current.dispose();
    }

    const voxelMap = new Map();
    function addV(x: number, y: number, z: number, color: THREE.Color) {
      voxelMap.set(`${x},${y},${z}`, { x, y, z, color });
    }
    function fillBlock(x1: number, x2: number, y1: number, y2: number, z1: number, z2: number, color: THREE.Color) {
      for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) addV(x, y, z, color);
    }

    const c_skin = new THREE.Color(0xf1c27d);
    const c_robe = provinceData ? new THREE.Color(provinceData.flag.primaryColor) : new THREE.Color(0x4a0e4e);
    const c_cape = provinceData ? new THREE.Color(provinceData.flag.secondaryColor) : new THREE.Color(0x9e1a1a);
    const c_gold = new THREE.Color(0xffd700);
    const c_white = new THREE.Color(0xffffff);
    const c_black = new THREE.Color(0x111111);
    const c_beard = new THREE.Color(0xf0f0f0);

    fillBlock(-5, 5, 12, 16, -4, 4, c_white); 
    fillBlock(-4, 4, 16, 20, -3, 3, c_robe);
    fillBlock(-1, 1, 14, 20, 3, 4, c_white); 
    fillBlock(-6, 6, 20, 22, -4, 4, c_white);
    fillBlock(-5, 5, 12, 22, -5, -4, c_cape);
    fillBlock(-7, -5, 16, 20, -1, 1, c_robe);
    fillBlock( 5, 7, 16, 20, -1, 1, c_robe);
    fillBlock(-2, 2, 23, 24, -1, 2, c_skin); 
    fillBlock(-3, 3, 25, 31, -3, 3, c_skin); 
    addV(-1, 29, 3, c_white); addV(-1, 29, 4, c_black);
    addV( 1, 29, 3, c_white); addV( 1, 29, 4, c_black);
    fillBlock( 0, 0, 27, 28, 4, 4, c_skin);
    fillBlock(-4, 4, 20, 25, 2, 5, c_beard);
    fillBlock(-3, 3, 26, 27, 4, 5, c_beard);
    const cy = 32;
    fillBlock(-4, 4, cy, cy+1, 4, 4, c_gold);
    fillBlock(-4, 4, cy, cy+1, -4, -4, c_gold);
    fillBlock(-4, -4, cy, cy+1, -3, 3, c_gold);
    fillBlock( 4, 4, cy, cy+1, -3, 3, c_gold);
    fillBlock( 0, 0, cy+2, cy+4, 4, 4, c_gold);

    const voxels = Array.from(voxelMap.values()) as any[];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.1 });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, voxels.length);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    voxels.forEach((v, i) => {
      dummy.position.set(v.x, v.y, v.z);
      dummy.scale.set(0.98, 0.98, 0.98);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      instancedMesh.setColorAt(i, v.color);
    });

    scene.add(instancedMesh);
    instancedMeshRef.current = instancedMesh;
  }, [provinceData]);

  return (
    <div ref={containerRef} className="w-full h-full pointer-events-none" />
  );
}
