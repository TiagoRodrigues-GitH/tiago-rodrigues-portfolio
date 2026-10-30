import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Number of forms (kept in sync with scene-shapes.ts, which is loaded lazily). */
const SHAPE_COUNT = 4;

const VERTEX = `#version 300 es
in vec4 aS0;
in vec4 aS1;
in vec4 aS2;
in vec4 aS3;
in float aR;
uniform float uMorph;
uniform float uTime;
uniform float uMotion;
uniform vec2 uRot;
uniform float uAspect;
uniform float uSize;
uniform float uZoom;
out vec3 vColor;
out float vAlpha;

void main() {
  float m = clamp(uMorph, 0.0, 3.0);
  float seg = min(floor(m), 2.0);
  float t = m - seg;
  // Each particle starts and ends its journey at a slightly different moment.
  float s = smoothstep(aR * 0.4, 0.6 + aR * 0.4, t);
  vec4 a = seg < 0.5 ? aS0 : (seg < 1.5 ? aS1 : aS2);
  vec4 b = seg < 0.5 ? aS1 : (seg < 1.5 ? aS2 : aS3);
  vec3 p = mix(a.xyz, b.xyz, s);
  float tag = mix(a.w, b.w, s);

  // Particles swirl outwards while in transit, then settle into the new form.
  float transit = sin(s * 3.14159);
  p += transit * 0.32 * vec3(sin(aR * 41.0 + uTime * 0.5), cos(aR * 29.0 + uTime * 0.4), sin(aR * 17.0));
  p += uMotion * 0.01 * vec3(sin(uTime * 1.3 + aR * 60.0), cos(uTime * 1.1 + aR * 50.0), sin(uTime * 0.9 + aR * 70.0));

  float cy = cos(uRot.x), sy = sin(uRot.x), cp = cos(uRot.y), sp = sin(uRot.y);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);

  float z = p.z + 3.4;
  vec2 proj = p.xy * uZoom / z;
  proj.x /= uAspect;
  gl_Position = vec4(proj, 0.0, 1.0);
  gl_PointSize = uSize * (1.0 + tag * 0.7) * 3.4 / z;

  vec3 blue = vec3(0.24, 0.48, 1.0);
  vec3 cyan = vec3(0.25, 0.88, 0.96);
  vec3 gold = vec3(0.80, 0.70, 0.48);
  vec3 base = mix(blue, cyan, clamp(0.5 + p.y * 0.55 + aR * 0.25, 0.0, 1.0));
  vColor = mix(base, gold, clamp(tag, 0.0, 1.0));
  vAlpha = clamp(1.55 - z * 0.33, 0.3, 1.0) * (0.75 + 0.25 * aR);
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
in vec3 vColor;
in float vAlpha;
out vec4 outColor;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  // Bright core with a soft halo.
  float a = (1.0 - d) * vAlpha;
  float core = 1.0 - smoothstep(0.0, 0.35, d);
  outColor = vec4(vColor * (a * 0.9 + core * 0.8), a);
}`;

/** Camera framing per form: yaw, pitch and zoom (neural, vision, circuit, architecture). */
const VIEWS: Array<[number, number, number]> = [
  [0.35, 0.12, 2.7],
  [0.55, 0.08, 2.75],
  [0.15, 0.55, 2.8],
  [0.6, 0.48, 2.8],
];

/**
 * Cinematic WebGL scene for the home hero: a neural network that turns into automotive computer
 * vision, an embedded circuit and a software architecture. The form follows the reader's scroll
 * through `track`; the camera follows the pointer. Decorative (aria-hidden): the meaning is in the
 * stage list the page renders next to it.
 *
 * Performance: one draw call of a few thousand points, rendering only while visible and not paused;
 * the device pixel ratio is capped and phones get fewer points. With prefers-reduced-motion the
 * scene does not animate: it redraws once per change of stage.
 */
@Component({
  selector: 'app-neural-hero',
  standalone: false,
  template: '<canvas #canvas class="scene" aria-hidden="true"></canvas>',
  styleUrls: ['./neural-hero.component.css'],
})
export class NeuralHeroComponent implements OnDestroy {
  /** Element whose scroll range drives the morph (the hero track). */
  @Input() track: HTMLElement | null = null;

  /** Form currently closest to the camera: 0..3. */
  readonly active = signal(0);
  readonly paused = signal(false);
  /** False when WebGL2 is unavailable; the page then shows only the stage list. */
  readonly supported = signal(true);

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private gl: WebGL2RenderingContext | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private count = 0;
  private frame = 0;
  private visible = true;
  private reducedMotion = false;
  private morph = 0;
  private targetMorph = 0;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private start = 0;
  private cleanup: Array<() => void> = [];
  private destroyed = false;

  constructor() {
    afterNextRender(() => this.init(), { injector: this.injector });
  }

  /** Shows form `index`: scrolls the track there when it drives the scene, otherwise morphs in place. */
  goTo(index: number): void {
    const range = this.scrollRange();
    const win = this.document.defaultView;
    if (range && win && this.track) {
      const top = this.track.getBoundingClientRect().top + win.scrollY;
      win.scrollTo({ top: top + (range * index) / (SHAPE_COUNT - 1), behavior: this.reducedMotion ? 'auto' : 'smooth' });
    } else {
      this.targetMorph = index;
      this.active.set(index);
      this.requestDraw();
    }
  }

  togglePause(): void {
    this.paused.update((p) => !p);
    this.requestDraw();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    // Also runs on the server (prerendering), where requestAnimationFrame does not exist.
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    this.cleanup.forEach((fn) => fn());
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private async init(): Promise<void> {
    const win = this.document.defaultView;
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!win || !gl) {
      this.supported.set(false);
      return;
    }
    this.gl = gl;
    const motionQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;
    const onMotion = (e: MediaQueryListEvent) => {
      this.reducedMotion = e.matches;
      this.requestDraw();
    };
    motionQuery.addEventListener('change', onMotion);
    this.cleanup.push(() => motionQuery.removeEventListener('change', onMotion));

    this.count = win.innerWidth < 700 ? 2600 : 5200;
    const program = this.program(gl);
    if (!program) {
      this.supported.set(false);
      return;
    }
    // The geometry generator is its own chunk: it never delays the first paint of the page.
    const { buildScene } = await import('./scene-shapes');
    if (this.destroyed) {
      return;
    }
    const { shapes, random } = buildScene(this.count);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    shapes.forEach((data, i) => this.attribute(gl, program, `aS${i}`, data, 4));
    this.attribute(gl, program, 'aR', random, 1);
    for (const name of ['uMorph', 'uTime', 'uMotion', 'uRot', 'uAspect', 'uSize', 'uZoom']) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    this.listen(win, 'scroll', () => this.onScroll(), { passive: true });
    this.listen(win, 'pointermove', (e) => this.onPointer(e as PointerEvent, win), { passive: true });
    this.listen(this.document, 'visibilitychange', () => this.requestDraw());

    const resize = new ResizeObserver(() => this.resize(win));
    resize.observe(canvas);
    this.cleanup.push(() => resize.disconnect());
    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.requestDraw();
    });
    io.observe(canvas);
    this.cleanup.push(() => io.disconnect());

    this.resize(win);
    this.onScroll();
    this.morph = this.targetMorph;
    this.start = performance.now();
    canvas.classList.add('ready');
    this.requestDraw();
  }

  private program(gl: WebGL2RenderingContext): WebGLProgram | null {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return null;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);
    return program;
  }

  private attribute(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, data: Float32Array, size: number): void {
    const location = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  private listen(target: EventTarget, type: string, handler: (e: Event) => void, options?: AddEventListenerOptions): void {
    target.addEventListener(type, handler, options);
    this.cleanup.push(() => target.removeEventListener(type, handler, options));
  }

  /** Pixels of scroll the track offers beyond one screen; 0 when it does not drive the scene. */
  private scrollRange(): number {
    const win = this.document.defaultView;
    if (!this.track || !win) return 0;
    const range = this.track.offsetHeight - win.innerHeight;
    return range > 40 ? range : 0;
  }

  private onScroll(): void {
    const range = this.scrollRange();
    if (!range || !this.track) return;
    const top = -this.track.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, top / range));
    this.targetMorph = progress * (SHAPE_COUNT - 1);
    this.active.set(Math.round(this.targetMorph));
    this.requestDraw();
  }

  private onPointer(e: PointerEvent, win: Window): void {
    if (e.pointerType === 'touch') return;
    this.pointer.tx = (e.clientX / win.innerWidth - 0.5) * 2;
    this.pointer.ty = (e.clientY / win.innerHeight - 0.5) * 2;
    this.requestDraw();
  }

  private resize(win: Window): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(win.devicePixelRatio || 1, 1.75);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      this.gl?.viewport(0, 0, width, height);
    }
    this.requestDraw();
  }

  private requestDraw(): void {
    if (!this.gl || this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.draw();
    });
  }

  private draw(): void {
    const gl = this.gl;
    const win = this.document.defaultView;
    if (!gl || !win || !this.visible || this.document.hidden) return;

    const animate = !this.reducedMotion && !this.paused();
    // Ease towards the scroll position; jump straight there without motion.
    this.morph = animate ? this.morph + (this.targetMorph - this.morph) * 0.08 : this.targetMorph;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * (animate ? 0.06 : 1);
    this.pointer.y += (this.pointer.ty - this.pointer.y) * (animate ? 0.06 : 1);
    const time = animate ? (performance.now() - this.start) / 1000 : 0;

    const i = Math.min(SHAPE_COUNT - 2, Math.floor(this.morph));
    const f = this.morph - i;
    const ease = f * f * (3 - 2 * f);
    const view = VIEWS[i].map((v, k) => v + (VIEWS[i + 1][k] - v) * ease);
    const drift = animate ? Math.sin(time * 0.18) * 0.18 : 0;
    const canvas = this.canvasRef.nativeElement;
    const narrow = canvas.clientWidth < 700;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(this.uniforms['uMorph'], this.morph);
    gl.uniform1f(this.uniforms['uTime'], time);
    gl.uniform1f(this.uniforms['uMotion'], animate ? 1 : 0);
    gl.uniform2f(this.uniforms['uRot'], view[0] + drift + this.pointer.x * 0.35, view[1] - this.pointer.y * 0.18);
    gl.uniform1f(this.uniforms['uAspect'], canvas.width / canvas.height);
    gl.uniform1f(this.uniforms['uSize'], (narrow ? 3.4 : 4.6) * Math.min(win.devicePixelRatio || 1, 1.75));
    gl.uniform1f(this.uniforms['uZoom'], view[2] * (narrow ? 0.82 : 1));
    gl.drawArrays(gl.POINTS, 0, this.count);

    const settling = Math.abs(this.targetMorph - this.morph) > 0.001 || Math.abs(this.pointer.tx - this.pointer.x) > 0.001;
    if (animate || settling) this.requestDraw();
  }
}
