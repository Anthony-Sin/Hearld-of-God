import * as THREE from 'three';
import { ViewLevel } from './types';

export interface LabelMesh extends THREE.Mesh {
  userData: {
    level: ViewLevel;
    id: number;
    priority: number;
    baseScale: number;
  };
}

export const LEVEL_PRIORITY: Record<ViewLevel, number> = {
    'Empire': 4,
    'Kingdom': 3,
    'Duchy': 2,
    'County': 1
};

export const createLabelMesh = (
    text: string, 
    level: ViewLevel, 
    id: number, 
    x: number, 
    z: number, 
    rotation: number, 
    terrainHeight: number, 
    color: string, 
    area: number,
    isVertical: boolean = false,
    constrainedScale: number = 1.0
) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const baseFontSize = 100;
    ctx.font = `900 ${baseFontSize}px "Cinzel", serif`;
    
    const textWidth = ctx.measureText(text).width;

    if (isVertical) {
        canvas.width = baseFontSize + 120;
        canvas.height = textWidth + 120;
    } else {
        canvas.width = textWidth + 120;
        canvas.height = baseFontSize + 120;
    }

    ctx.font = `900 ${baseFontSize}px "Cinzel", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (isVertical) {
        ctx.rotate(Math.PI / 2);
    }

    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = 18;
    ctx.strokeText(text, 0, 0);
    
    ctx.fillStyle = '#ffffff'; 
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    
    const areaScale = Math.sqrt(area) * 0.015; 
    const levelBase = level === 'Empire' ? 4.0 : level === 'Kingdom' ? 2.5 : level === 'Duchy' ? 1.5 : level === 'County' ? 0.8 : 0.6;
    const finalBaseScale = levelBase * areaScale * constrainedScale;

    const planeGeo = new THREE.PlaneGeometry(canvas.width * 0.05, canvas.height * 0.05);
    const planeMat = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true, 
      opacity: 0,
      alphaTest: 0.01,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const mesh = new THREE.Mesh(planeGeo, planeMat) as unknown as LabelMesh;
    mesh.rotation.x = -Math.PI / 2.1; 
    mesh.rotation.z = rotation;
    mesh.scale.setScalar(finalBaseScale);
    
    mesh.position.set(x, terrainHeight + 1.2, z);
    mesh.userData = { 
        level, 
        id, 
        priority: LEVEL_PRIORITY[level],
        baseScale: finalBaseScale
    };
    return mesh;
};

export const updateLabelsCollision = (labelGroup: THREE.Group, level: ViewLevel, camera: THREE.Camera, controls: any) => {
    const visibleNames: LabelMesh[] = [];
    const dist = camera.position.distanceTo(controls.target);

    labelGroup.children.forEach(child => {
        const mesh = child as LabelMesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        
        // CK3 Style: Exclusive tiers. As you zoom in, higher tiers vanish.
        let targetOpacity = 0;
        if (mesh.userData.level === 'Empire') {
            // Empires are visible from far away, start fading out as we enter Kingdom view
            targetOpacity = dist > 200 ? 1 : dist < 120 ? 0 : (dist - 120) / 80;
        } else if (mesh.userData.level === 'Kingdom') {
            // Kingdoms visible in middle distances
            if (dist > 150) targetOpacity = Math.max(0, 1 - (dist - 150) / 100);
            else if (dist < 80) targetOpacity = 0;
            else targetOpacity = (dist - 80) / 70;
        } else if (mesh.userData.level === 'Duchy') {
            // Duchies visible as we zoom into region
            if (dist > 100) targetOpacity = 0;
            else if (dist < 40) targetOpacity = 0;
            else targetOpacity = (dist - 40) / 60;
        } else if (mesh.userData.level === 'County') {
            // Counties visible only when zoomed in close
            targetOpacity = dist < 60 ? 1 : Math.max(0, 1 - (dist - 60) / 40);
        }

        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
        if (mat.opacity > 0.01) {
            mesh.visible = true;
            visibleNames.push(mesh);
        } else {
            mesh.visible = false;
        }

        mesh.scale.setScalar(mesh.userData.baseScale);
    });

    visibleNames.sort((a, b) => b.userData.priority - a.userData.priority);

    for (let i = 0; i < visibleNames.length; i++) {
        const meshA = visibleNames[i];
        for (let j = i + 1; j < visibleNames.length; j++) {
            const meshB = visibleNames[j];
            const distSq = meshA.position.distanceToSquared(meshB.position);
            
            const threshold = (meshA.userData.baseScale + meshB.userData.baseScale) * 14; 
            if (distSq < threshold * threshold) {
                meshB.scale.setScalar(meshB.scale.x * 0.45); 
                if (distSq < (threshold * 0.45) * (threshold * 0.45)) {
                    meshB.visible = false;
                }
            }
        }
    }
};
