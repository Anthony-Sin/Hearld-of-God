import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BaronyData } from '@map/mapGenerator.ts';
import { rendererPool } from '@shared/threeSingleton';
import { HeraldStats } from '@shared/types';

interface VoxelCharacterProps {
  provinceData: BaronyData | null;
  stats: HeraldStats;
  traitIds: string[];
}

function createCircleTexture(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function VoxelCharacter({ provinceData, stats, traitIds }: VoxelCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const particlesRef = useRef<{ halo: THREE.Points; smoke: THREE.Points } | null>(null);

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

    // Particle Systems
    const haloGeo = new THREE.BufferGeometry();
    const haloPos = new Float32Array(50 * 3);
    haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
    const haloMat = new THREE.PointsMaterial({
      size: 0.5,
      map: createCircleTexture('rgba(255, 215, 0, 0.8)'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const haloPoints = new THREE.Points(haloGeo, haloMat);
    scene.add(haloPoints);

    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(100 * 3);
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      size: 0.8,
      map: createCircleTexture('rgba(100, 0, 150, 0.5)'),
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokePoints);

    particlesRef.current = { halo: haloPoints, smoke: smokePoints };

    let frameId: number;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      if (particlesRef.current) {
        const { halo, smoke } = particlesRef.current;
        const t = time * 0.001;

        // Animate Halo
        const hPos = halo.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < 50; i++) {
          const angle = (i / 50) * Math.PI * 2 + t;
          hPos[i * 3] = Math.cos(angle) * 6;
          hPos[i * 3 + 1] = 28 + Math.sin(t * 2 + i) * 0.5;
          hPos[i * 3 + 2] = Math.sin(angle) * 6;
        }
        halo.geometry.attributes.position.needsUpdate = true;

        // Animate Smoke
        const sPos = smoke.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < 100; i++) {
          const x = ((i * 13) % 20) - 10;
          const z = ((i * 17) % 20) - 10;
          const y = (t + i * 0.1) % 5;
          sPos[i * 3] = x;
          sPos[i * 3 + 1] = 12 + y;
          sPos[i * 3 + 2] = z;
        }
        smoke.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);

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
      // We don't remove renderer.domElement here because rendererPool handles reuse
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

    // Renown Milestones
    if (stats.renown >= 100) {
      // Crown
      const cy = 32;
      fillBlock(-4, 4, cy, cy, 4, 4, c_gold);
      fillBlock(-4, 4, cy, cy, -4, -4, c_gold);
      fillBlock(-4, -4, cy, cy, -3, 3, c_gold);
      fillBlock( 4, 4, cy, cy, -3, 3, c_gold);
      addV(-4, cy+1, 4, c_gold); addV(4, cy+1, 4, c_gold);
      addV(-4, cy+1, -4, c_gold); addV(4, cy+1, -4, c_gold);
      fillBlock( 0, 0, cy+1, cy+3, 4, 4, c_gold);
    }

    if (stats.renown >= 250) {
      // Cloak
      fillBlock(-6, 6, 12, 23, -6, -5, c_cape);
      fillBlock(-7, -6, 12, 23, -5, 4, c_cape);
      fillBlock( 6, 7, 12, 23, -5, 4, c_cape);
      fillBlock(-8, -5, 21, 23, -2, 2, c_gold);
      fillBlock( 5, 8, 21, 23, -2, 2, c_gold);
    }

    if (stats.renown >= 500) {
      // Divine Orb
      fillBlock(7, 9, 18, 20, 2, 4, new THREE.Color(0x00ffff));
      addV(8, 21, 3, new THREE.Color(0xffffff));
      addV(8, 17, 3, new THREE.Color(0xffffff));
    }

    const voxels = Array.from(voxelMap.values()) as any[];

    // Visibility of particles
    if (particlesRef.current) {
      particlesRef.current.halo.visible = stats.divinity > 70 || traitIds.includes('brilliant') || traitIds.includes('chosen_one');
      particlesRef.current.smoke.visible = stats.corruption > 70;
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.1 });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, voxels.length);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    const isAncient = traitIds.includes('ancient');
    const isTowering = traitIds.includes('towering');
    const isScarred = traitIds.includes('scarred');
    const isCraven = traitIds.includes('craven');
    const isChosen = traitIds.includes('chosen_one');
    const isBrilliant = traitIds.includes('brilliant');

    const desaturation = Math.max(0, isAncient ? 0.5 : 0, stats.divinity < 30 ? (30 - stats.divinity) / 30 : 0);
    const corruptionLevel = stats.corruption > 70 ? (stats.corruption - 70) / 30 : 0;

    const dummy = new THREE.Object3D();
    voxels.forEach((v, i) => {
      let finalColor = v.color.clone();

      if (desaturation > 0) {
        const gray = (finalColor.r + finalColor.g + finalColor.b) / 3;
        finalColor.lerp(new THREE.Color(gray, gray, gray), desaturation);
      }

      if (corruptionLevel > 0) {
        const isOuter = Math.abs(v.x) >= 4 || Math.abs(v.z) >= 4;
        if (isOuter) {
          finalColor.lerp(new THREE.Color(0x4b0082), corruptionLevel * 0.5);
        }
      }

      if (isChosen || isBrilliant) {
        finalColor.lerp(new THREE.Color(0xfff5d7), 0.15);
      }

      const voxelSeed = (v.x * 73856093) ^ (v.y * 19349663) ^ (v.z * 83492791);
      const pseudoRandom = (Math.abs(voxelSeed) % 1000) / 1000;
      if (isScarred && pseudoRandom < 0.05 && v.y > 23) {
        finalColor.multiplyScalar(0.3);
      }

      let sx = 0.98;
      let sy = 0.98;
      let sz = 0.98;
      let px = v.x;
      let py = v.y;
      let pz = v.z;

      if (isTowering) {
        sx *= 1.1; sy *= 1.15; sz *= 1.1;
        px *= 1.1; py *= 1.15; pz *= 1.1;
      }

      dummy.position.set(px, py, pz);

      if (isCraven && v.y > 20) {
        dummy.position.z += (v.y - 20) * 0.1;
        dummy.position.y -= (v.y - 20) * 0.05;
        finalColor.lerp(new THREE.Color(0xffffcc), 0.1);
      }

      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      instancedMesh.setColorAt(i, finalColor);
    });

    scene.add(instancedMesh);
    instancedMeshRef.current = instancedMesh;
  }, [provinceData, stats, traitIds]);

  return (
    <div ref={containerRef} className="w-full h-full pointer-events-none" />
  );
}
