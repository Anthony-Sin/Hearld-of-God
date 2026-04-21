import * as THREE from 'three';

/**
 * Singleton manager to ensure we only have ONE WebGL context for each 
 * major component type, preventing "Web page caused context loss" errors.
 */

class RendererPool {
  private mapRenderer: THREE.WebGLRenderer | null = null;
  private charRenderer: THREE.WebGLRenderer | null = null;

  getMapRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    if (!this.mapRenderer) {
      this.mapRenderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true
      });
      console.log('Created Singleton Map Renderer');
    }
    
    const renderer = this.mapRenderer;
    if (renderer.domElement.parentElement !== container) {
      container.appendChild(renderer.domElement);
    }
    
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const currentSize = new THREE.Vector2();
    renderer.getSize(currentSize);
    
    if (currentSize.x !== w || currentSize.y !== h) {
       renderer.setSize(w, h);
    }
    
    return renderer;
  }

  getCharRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    if (!this.charRenderer) {
      this.charRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power' // Portraits don't need high power
      });
      console.log('Created Singleton Char Renderer');
    }
    
    const renderer = this.charRenderer;
    if (renderer.domElement.parentElement !== container) {
      container.appendChild(renderer.domElement);
    }

    const w = container.clientWidth || 200;
    const h = container.clientHeight || 200;
    const currentSize = new THREE.Vector2();
    renderer.getSize(currentSize);
    
    if (currentSize.x !== w || currentSize.y !== h) {
       renderer.setSize(w, h);
    }

    return renderer;
  }
}

export const rendererPool = new RendererPool();
