import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import type * as THREE from 'three';
import { Locale } from '../../services/i18n.service';

type Three = typeof THREE;

/** Brand palette: gold, sage, off-white (see styles.css). Every language shares it. */
const GOLD = 0xc5a15b;
const SAGE = 0x819c96;
const OFFWHITE = 0xe8e7e1;
const COLORS = [GOLD, SAGE, OFFWHITE];

/**
 * Real-time 3D scene in the hero, one per art direction (see content/videos):
 * - pt cinematic: only gold dust drifting in the light, so the full-bleed portrait stays the subject;
 * - en editorial: a gold wireframe "computational" sphere with off-white nodes;
 * - de minimal: a chrome dodecahedron with gold edges and two orbit rings.
 * It turns slowly and leans toward the pointer. three.js loads lazily in the browser only; without
 * WebGL the hero keeps its video. Decorative (aria-hidden).
 */
@Component({
  selector: 'app-hero-scene',
  standalone: false,
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styleUrls: ['./hero-scene.component.css'],
})
export class HeroSceneComponent implements OnChanges, OnDestroy {
  @Input() locale: Locale = 'pt';

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private three?: Three;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private group?: THREE.Group;
  private frame = 0;
  private visible = true;
  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private readonly pointer = { x: 0, y: 0 };
  private readonly onPointer = (event: PointerEvent) => {
    this.pointer.x = (event.clientX / innerWidth) * 2 - 1;
    this.pointer.y = (event.clientY / innerHeight) * 2 - 1;
  };

  constructor(private readonly host: ElementRef<HTMLElement>) {
    afterNextRender(() => void this.start());
  }

  ngOnChanges(): void {
    if (this.three) {
      this.build();
    }
  }

  ngOnDestroy(): void {
    if (!this.renderer) {
      return; // Never started: prerendering, or no WebGL.
    }
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    removeEventListener('pointermove', this.onPointer);
    this.clear();
    this.renderer.dispose();
  }

  private async start(): Promise<void> {
    let three: Three;
    let RoomEnvironment: typeof import('three/examples/jsm/environments/RoomEnvironment.js').RoomEnvironment;
    try {
      three = await import('three');
      ({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'));
      this.renderer = new three.WebGLRenderer({ canvas: this.canvasRef.nativeElement, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // No WebGL: the video background stays on its own.
    }
    this.three = three;
    const renderer = this.renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = three.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    this.scene = new three.Scene();
    const pmrem = new three.PMREMGenerator(renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.camera = new three.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.build();
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host.nativeElement);
    this.observer = new IntersectionObserver(([entry]) => (this.visible = entry.isIntersecting));
    this.observer.observe(this.host.nativeElement);
    addEventListener('pointermove', this.onPointer, { passive: true });
    this.host.nativeElement.classList.add('ready');
    this.loop(performance.now());
  }

  /** (Re)creates the object for the current language. */
  private build(): void {
    const three = this.three!;
    this.clear();
    const group = new three.Group();
    const color = new three.Color();

    if (this.locale === 'en') {
      // Editorial: a computational sphere — gold wireframe, off-white nodes at its vertices, a dark teal core.
      const sphere = new three.IcosahedronGeometry(1.55, 2);
      group.add(new three.LineSegments(new three.WireframeGeometry(sphere), new three.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })));
      group.add(new three.Points(sphere, new three.PointsMaterial({ color: OFFWHITE, size: 0.05, transparent: true, opacity: 0.9, depthWrite: false })));
      group.add(new three.Mesh(new three.SphereGeometry(1.2, 64, 64), new three.MeshPhysicalMaterial({ color: 0x172e30, metalness: 0.4, roughness: 0.35, clearcoat: 1, envMapIntensity: 1.2 })));
    } else if (this.locale === 'de') {
      // Minimal: polished chrome, gold hairline edges, two thin orbit rings.
      const core = new three.DodecahedronGeometry(1.35, 0);
      group.add(new three.Mesh(core, new three.MeshPhysicalMaterial({ color: 0xe8e7e1, metalness: 0.9, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 3.2 })));
      const edges = new three.LineSegments(new three.EdgesGeometry(core), new three.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 1, blending: three.AdditiveBlending }));
      edges.scale.setScalar(1.012);
      group.add(edges);
      for (const [radius, tilt] of [[2.1, 0.35], [2.5, -0.6]]) {
        const ring = new three.Mesh(new three.TorusGeometry(radius, 0.006, 8, 200), new three.MeshBasicMaterial({ color: OFFWHITE, transparent: true, opacity: 0.4 }));
        ring.rotation.x = Math.PI / 2 + tilt;
        group.add(ring);
      }
    }

    // Particle field: dust in the light (pt fills the frame; en and de keep it around the object).
    const cinematic = this.locale === 'pt';
    const count = cinematic ? 1600 : 700;
    const field: number[] = [];
    const fieldColors: number[] = [];
    for (let i = 0; i < count; i++) {
      const v = new three.Vector3().randomDirection().multiplyScalar(cinematic ? 1 + Math.random() * 7 : 2.4 + Math.random() * 4.5);
      field.push(v.x * 1.6, v.y, v.z);
      color.setHex(cinematic ? (i % 5 ? GOLD : OFFWHITE) : COLORS[i % COLORS.length]);
      fieldColors.push(color.r, color.g, color.b);
    }
    const dust = new three.BufferGeometry();
    dust.setAttribute('position', new three.Float32BufferAttribute(field, 3));
    dust.setAttribute('color', new three.Float32BufferAttribute(fieldColors, 3));
    const particles = new three.Points(dust, new three.PointsMaterial({ size: cinematic ? 0.035 : 0.025, vertexColors: true, transparent: true, opacity: 0.65, blending: three.AdditiveBlending, depthWrite: false }));
    particles.name = 'field';
    group.add(particles);

    // Warm key and cool rim light, in the palette.
    const key = new three.PointLight(GOLD, 160, 25);
    key.position.set(4, 3, 4);
    const rim = new three.PointLight(SAGE, 120, 25);
    rim.position.set(-4, -2, 3);
    this.scene!.add(key, rim);

    this.scene!.add(group);
    this.group = group;
    this.layout();
  }

  private clear(): void {
    if (!this.scene) {
      return;
    }
    for (const child of [...this.scene.children]) {
      this.scene.remove(child);
      child.traverse((node) => {
        const mesh = node as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        materials.forEach((m) => m.dispose());
      });
    }
  }

  private resize(): void {
    const { clientWidth: width, clientHeight: height } = this.host.nativeElement;
    if (!this.renderer || !this.camera || !width || !height) {
      return;
    }
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.layout();
  }

  /** On wide screens the object sits beside the copy; on narrow ones it floats behind it. The dust (pt) fills the frame. */
  private layout(): void {
    if (!this.group || !this.camera) {
      return;
    }
    if (this.locale === 'pt') {
      this.group.position.set(0, 0, 0);
      this.group.scale.setScalar(1);
      return;
    }
    const wide = this.camera.aspect > 1.15;
    this.group.position.set(wide ? 1.15 + this.camera.aspect * 1.25 : 0, wide ? 0 : 1.2, 0);
    this.group.scale.setScalar(wide ? 1 : 0.8);
  }

  private loop(time: number): void {
    this.frame = requestAnimationFrame((t) => this.loop(t));
    if (!this.visible || document.hidden || !this.group || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    const t = time / 1000;
    const group = this.group;
    // Slow turn plus a lean toward the pointer, eased.
    group.rotation.y += (t * 0.18 + this.pointer.x * 0.6 - group.rotation.y) * 0.05;
    group.rotation.x += (Math.sin(t * 0.3) * 0.15 + this.pointer.y * 0.4 - group.rotation.x) * 0.05;
    const field = group.getObjectByName('field');
    if (field) {
      field.rotation.y = -t * 0.04;
    }
    this.camera.position.x += (this.pointer.x * 0.5 - this.camera.position.x) * 0.04;
    this.camera.position.y += (-this.pointer.y * 0.35 - this.camera.position.y) * 0.04;
    this.camera.lookAt(group.position.x * 0.5, group.position.y * 0.5, 0);
    this.renderer.render(this.scene, this.camera);
  }
}
