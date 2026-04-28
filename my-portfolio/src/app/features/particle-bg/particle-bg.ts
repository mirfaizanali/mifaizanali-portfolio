import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-particle-bg',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class ParticleBg implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private animationId = 0;
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };
  private resizeObserver: ResizeObserver | null = null;

  // Connection lines
  private lineMesh!: THREE.LineSegments;
  private particlePositions!: Float32Array;
  private particleCount = 0;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => this.init());
  }

  private init() {
    const canvas = this.canvasRef().nativeElement;
    const parent = canvas.parentElement!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 50;

    // Particles
    this.createParticles();

    // Connection lines
    this.createConnectionLines();

    // Mouse tracking
    window.addEventListener('mousemove', this.onMouseMove);

    // Resize
    this.resizeObserver = new ResizeObserver(() => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
    this.resizeObserver.observe(parent);

    this.animate();
  }

  private createParticles() {
    this.particleCount = window.innerWidth < 768 ? 80 : 200;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      this.particlePositions[i3] = (Math.random() - 0.5) * 100;
      this.particlePositions[i3 + 1] = (Math.random() - 0.5) * 100;
      this.particlePositions[i3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#00bcd4') },
        uColor2: { value: new THREE.Color('#7c3aed') },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          vec3 pos = position;

          // Gentle floating motion
          pos.x += sin(uTime * 0.3 + position.y * 0.1) * 1.5;
          pos.y += cos(uTime * 0.2 + position.x * 0.1) * 1.5;
          pos.z += sin(uTime * 0.15 + position.x * 0.05) * 1.0;

          // Mouse influence - particles gently attracted/repelled
          float distToMouse = length(pos.xy - uMouse * 40.0);
          float mouseInfluence = smoothstep(30.0, 0.0, distToMouse);
          pos.xy += normalize(pos.xy - uMouse * 40.0 + 0.001) * mouseInfluence * 3.0;
          pos.z += mouseInfluence * 5.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * (200.0 / -mvPosition.z);

          // Depth-based alpha
          vAlpha = smoothstep(-60.0, 10.0, pos.z) * 0.8;
          vColorMix = sin(uTime * 0.5 + position.x * 0.1) * 0.5 + 0.5;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);

          vec3 color = mix(uColor1, uColor2, vColorMix);
          gl_FragColor = vec4(color, glow * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createConnectionLines() {
    const maxConnections = this.particleCount * 3;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 4);

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 4));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.lineMesh);
  }

  private updateConnectionLines(time: number) {
    const positions = this.particles.geometry.attributes['position'].array as Float32Array;
    const linePositions = this.lineMesh.geometry.attributes['position'].array as Float32Array;
    const lineColors = this.lineMesh.geometry.attributes['color'].array as Float32Array;
    const maxDist = 18;
    let lineIndex = 0;
    const cyan = new THREE.Color('#00bcd4');

    for (let i = 0; i < this.particleCount; i++) {
      for (let j = i + 1; j < this.particleCount; j++) {
        const i3 = i * 3;
        const j3 = j * 3;

        // Use original positions + offset for approximate positions
        const dx = this.particlePositions[i3] - this.particlePositions[j3];
        const dy = this.particlePositions[i3 + 1] - this.particlePositions[j3 + 1];
        const dz = this.particlePositions[i3 + 2] - this.particlePositions[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist && lineIndex < linePositions.length / 6) {
          const alpha = (1 - dist / maxDist) * 0.15;
          const li = lineIndex * 6;
          const ci = lineIndex * 8;

          linePositions[li] = this.particlePositions[i3];
          linePositions[li + 1] = this.particlePositions[i3 + 1];
          linePositions[li + 2] = this.particlePositions[i3 + 2];
          linePositions[li + 3] = this.particlePositions[j3];
          linePositions[li + 4] = this.particlePositions[j3 + 1];
          linePositions[li + 5] = this.particlePositions[j3 + 2];

          lineColors[ci] = cyan.r;
          lineColors[ci + 1] = cyan.g;
          lineColors[ci + 2] = cyan.b;
          lineColors[ci + 3] = alpha;
          lineColors[ci + 4] = cyan.r;
          lineColors[ci + 5] = cyan.g;
          lineColors[ci + 6] = cyan.b;
          lineColors[ci + 7] = alpha;

          lineIndex++;
        }
      }
    }

    // Zero out remaining
    for (let i = lineIndex * 6; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }
    for (let i = lineIndex * 8; i < lineColors.length; i++) {
      lineColors[i] = 0;
    }

    this.lineMesh.geometry.attributes['position'].needsUpdate = true;
    this.lineMesh.geometry.attributes['color'].needsUpdate = true;
    this.lineMesh.geometry.setDrawRange(0, lineIndex * 2);
  }

  private onMouseMove = (e: MouseEvent) => {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    const material = this.particles.material as THREE.ShaderMaterial;
    material.uniforms['uTime'].value = performance.now() * 0.001;
    material.uniforms['uMouse'].value.set(this.mouse.x, this.mouse.y);

    // Subtle camera sway
    this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    // Update connection lines every few frames for performance
    if (Math.floor(performance.now() * 0.001 * 10) % 3 === 0) {
      this.updateConnectionLines(performance.now() * 0.001);
    }

    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    this.particles?.geometry.dispose();
    (this.particles?.material as THREE.Material)?.dispose();
    this.lineMesh?.geometry.dispose();
    (this.lineMesh?.material as THREE.Material)?.dispose();
  }
}
