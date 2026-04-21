import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CameraConfig {
  width: number;
  depth: number;
  domElement: HTMLElement | null | undefined;
}

export function useCamera({ width, depth, domElement }: CameraConfig) {
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  useEffect(() => {
    if (!domElement) return;

    // 1. Setup Camera
    const newCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    
    // Position camera to view the entire board isometric-ally
    const camOffset = Math.max(width, depth) * 1.0; // Moved closer as requested
    newCamera.position.set(camOffset, camOffset * 0.8, camOffset);
    newCamera.lookAt(width / 2, 0, depth / 2);
    setCamera(newCamera);

    // 2. Setup Controls
    const newControls = new OrbitControls(newCamera, domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.08; // Slightly more damped for smoother flow
    newControls.rotateSpeed = 1.2; // Faster rotation as requested
    newControls.zoomSpeed = 1.2;
    newControls.panSpeed = 1.0;
    newControls.screenSpacePanning = true; 
    newControls.listenToKeyEvents(window); // Enable keyboard support
    newControls.keyPanSpeed = 20.0; // Faster keyboard panning as requested
    newControls.minDistance = 10;
    newControls.maxDistance = camOffset * 2.0; // Adjusted max distance
    newControls.maxPolarAngle = Math.PI / 2.1; 
    newControls.target.set(width / 2, 0, depth / 2);
    setControls(newControls);

    // 3. Resize Handler
    const handleResize = () => {
      const w = domElement.clientWidth || window.innerWidth;
      const h = domElement.clientHeight || window.innerHeight;
      newCamera.aspect = w / h;
      newCamera.updateProjectionMatrix();
      
      // We don't have renderer here, so the parent component should handle renderer.setSize
    };
    
    // Initial size fix
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(domElement);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      newControls.dispose();
    };
  }, [width, depth, domElement]);

  return { camera, controls };
}
