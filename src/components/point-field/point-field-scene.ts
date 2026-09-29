import * as THREE from "three";
import type { ShapePoints } from "./sample-shapes";

// Одне поле точок на всю сторінку. У hero — рельєф із хвилею від курсора
// (перспективна камера), далі точки перетікають у лінійні сцени секцій:
// позиція змішується між «рельєфом» і «формою» прямо в clip space, а форма
// прив'язана до прямокутника SVG на екрані (uRect), тож їде разом зі скролом.

const MAX_SHAPES = 3;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uShapeSize;
  uniform vec2 uViewport;
  uniform float uTerrainAlpha;
  uniform float uWide;
  uniform vec4 uRect[${MAX_SHAPES}];
  uniform float uWeight[${MAX_SHAPES}];
  uniform vec3 uBase;
  uniform vec3 uLine;
  uniform vec3 uAccent;
  uniform vec3 uOk;

  attribute vec3 aRand;
  attribute vec3 aShape0;
  attribute vec3 aShape1;
  attribute vec3 aShape2;

  varying vec3 vColor;
  varying float vAlpha;

  // 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Точка форми в NDC: (u, v) усередині прямокутника SVG на екрані.
  vec2 shapeNdc(vec3 s, vec4 rect) {
    vec2 px = rect.xy + s.xy * rect.zw;
    return vec2(px.x / uViewport.x * 2.0 - 1.0, 1.0 - px.y / uViewport.y * 2.0);
  }

  void main() {
    // --- Рельєф ---
    vec3 p = position;
    float t = uTime * 0.12;
    float h = snoise(p.xz * 0.18 + vec2(t, t * 0.6)) * 0.55
            + snoise(p.xz * 0.45 - vec2(t * 0.8, 0.0)) * 0.18;
    float d = distance(p.xz, uMouse);
    float ripple = sin(d * 3.2 - uTime * 3.0) * exp(-d * 0.55) * uMouseStrength;
    p.y += h + ripple * 0.35;
    float glow = clamp(exp(-d * 0.65) * uMouseStrength + smoothstep(0.35, 0.9, h) * 0.55, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 terrainNdc = clip.xy / clip.w;
    float fade = smoothstep(-26.0, -6.0, mv.z) * (1.0 - smoothstep(9.0, 15.0, abs(p.x)));
    // Приглушуємо рельєф під текстом hero: ліворуч на широких екранах, згори на вузьких.
    float mask = mix(
      mix(0.25, 1.0, smoothstep(0.95, 0.1, terrainNdc.y)),
      mix(0.45, 1.0, smoothstep(-1.0, 0.2, terrainNdc.x)),
      uWide
    );
    float terrainAlpha = fade * mix(0.7, 1.0, glow) * uTerrainAlpha * mask;
    vec3 terrainColor = mix(uBase, uAccent, glow);
    float terrainSize = uSize * (1.0 + glow * 1.2) * (8.0 / -mv.z);

    // --- Форми ---
    vec2 ndc = terrainNdc;
    float alpha = terrainAlpha;
    vec3 color = terrainColor;
    float size = terrainSize;

    vec3 shapes[${MAX_SHAPES}];
    shapes[0] = aShape0;
    shapes[1] = aShape1;
    shapes[2] = aShape2;

    for (int k = 0; k < ${MAX_SHAPES}; k++) {
      float w = uWeight[k];
      if (w <= 0.0) continue;
      // Кожна точка стартує зі своєю затримкою — форма «збирається», а не стрибає.
      float wp = smoothstep(aRand.x * 0.45, aRand.x * 0.45 + 0.55, w);
      vec3 s = shapes[k];
      bool used = s.x >= 0.0;
      vec2 target = used ? shapeNdc(s, uRect[k]) : ndc;
      // Легкий вихор під час перельоту.
      float swirl = wp * (1.0 - wp) * 4.0;
      vec2 wobble = vec2(sin(aRand.y * 6.2831 + uTime), cos(aRand.z * 6.2831 + uTime)) * 0.06 * swirl;
      ndc = mix(ndc, target, wp) + wobble;

      // Тон: 0 — лінія, 1 — акцент, 2 — «онлайн», 3 — другорядна лінія.
      bool sub = s.z > 2.5;
      bool tinted = s.z > 0.5 && !sub;
      vec3 tone = s.z > 1.5 && !sub ? uOk : (tinted ? uAccent : uLine);
      float twinkle = tinted ? 0.8 + 0.2 * sin(uTime * 2.0 + aRand.y * 40.0) : 1.0;
      float shapeAlpha = used ? (tinted ? 1.0 : (sub ? 0.28 : 0.6)) * twinkle : 0.0;
      alpha = mix(alpha, shapeAlpha, wp);
      color = mix(color, tone, wp);
      size = mix(size, uShapeSize * (tinted ? 1.25 : 1.0), wp);
    }

    vColor = color;
    vAlpha = alpha;
    gl_Position = vec4(ndc, 0.0, 1.0);
    gl_PointSize = size * uPixelRatio;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.004) discard;
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.1, r) * vAlpha);
  }
`;

export type PointField = {
  compile: () => Promise<void>;
  start: () => void;
  stop: () => void;
  setPointer: (x: number, y: number) => void; // NDC −1…1
  setShapes: (shapes: ShapePoints[]) => void;
  resize: () => void;
  dispose: () => void;
};

type Options = { canvas: HTMLCanvasElement; accent: string; ok: string; dense: boolean };

export function createPointField({ canvas, accent, ok, dense }: Options): PointField {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  const baseCamera = new THREE.Vector3(0, 2.6, 8.5);
  camera.position.copy(baseCamera);

  // Сітка рельєфу: кожна точка — також кандидат на точку форми.
  const cols = dense ? 240 : 120;
  const rows = dense ? 140 : 70;
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const rand = new Float32Array(count * 3);
  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < cols; x++) {
      const i = z * cols + x;
      positions[i * 3] = (x / (cols - 1) - 0.5) * 30;
      positions[i * 3 + 2] = -(z / (rows - 1)) * 26 + 4;
    }
  }
  for (let i = 0; i < rand.length; i++) rand[i] = Math.random();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));
  const emptyShape = () => new Float32Array(count * 3).fill(-1);
  for (let k = 0; k < MAX_SHAPES; k++) {
    geometry.setAttribute(`aShape${k}`, new THREE.BufferAttribute(emptyShape(), 3));
  }

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseStrength: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: dense ? 2.8 : 3.2 },
    uShapeSize: { value: dense ? 2.2 : 2.0 },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uTerrainAlpha: { value: 1 },
    uWide: { value: 1 },
    uRect: { value: Array.from({ length: MAX_SHAPES }, () => new THREE.Vector4()) },
    uWeight: { value: new Array<number>(MAX_SHAPES).fill(0) },
    uBase: { value: new THREE.Color("#9a9ba0") },
    uLine: { value: new THREE.Color("#cfcdc8") },
    uAccent: { value: new THREE.Color(accent) },
    uOk: { value: new THREE.Color(ok) },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; // позиції рахуються в шейдері
  scene.add(points);

  // Цілі форм: SVG-елементи на сторінці та їхні порядкові номери в атрибутах.
  let targets: Array<{ el: Element; slot: number }> = [];
  const hero = document.getElementById("top");

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const target = new THREE.Vector2(99, 99);
  let pointerActive = false;
  let lastMove = 0;

  const timer = new THREE.Timer();
  let elapsed = 0;
  let frame = 0;
  let running = false;
  let compiled = false;

  // Вага форми — частка її SVG, що видно на екрані: повністю видно → форма зібрана.
  // (Не відстань до центру: футер у кінці сторінки до центру не доїжджає.)
  const updateScroll = () => {
    const vh = window.innerHeight;
    const heroRect = hero?.getBoundingClientRect();
    uniforms.uTerrainAlpha.value = heroRect
      ? THREE.MathUtils.smoothstep(heroRect.bottom / vh, 0.15, 0.7)
      : 0;

    let best = -1;
    let bestW = 0;
    const weights = targets.map(({ el, slot }) => {
      const r = el.getBoundingClientRect();
      uniforms.uRect.value[slot]!.set(r.left, r.top, r.width, r.height);
      const visible = Math.max(0, Math.min(r.bottom, vh - 40) - Math.max(r.top, 80));
      const w = THREE.MathUtils.smoothstep(visible / Math.max(1, r.height), 0.3, 0.95);
      if (w > bestW) {
        bestW = w;
        best = slot;
      }
      return { slot, w };
    });
    // Точки можуть бути лише в одній формі: беремо найближчу до центру.
    for (const { slot } of weights) uniforms.uWeight.value[slot] = slot === best ? bestW : 0;
  };

  const render = () => {
    timer.update();
    const t = (elapsed += Math.min(timer.getDelta(), 0.1));
    uniforms.uTime.value = t;

    const idle = t - lastMove > 2.5;
    const strength = pointerActive && !idle ? 1 : 0;
    uniforms.uMouseStrength.value += (strength - uniforms.uMouseStrength.value) * 0.05;
    uniforms.uMouse.value.lerp(target, 0.08);

    camera.position.x += (baseCamera.x + ndc.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (baseCamera.y + ndc.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, -0.2, -4);

    updateScroll();
    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    frame = requestAnimationFrame(loop);
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uViewport.value.set(w, h);
    uniforms.uWide.value = w >= 1280 ? 1 : 0;
    camera.aspect = w / h;
    camera.position.z = baseCamera.z = w < 768 ? 11 : 8.5;
    camera.updateProjectionMatrix();
    if (!running && compiled) render();
  };

  resize();

  return {
    async compile() {
      await renderer.compileAsync(scene, camera);
      compiled = true;
    },
    start() {
      if (running) return;
      running = true;
      timer.reset();
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    setPointer(x, y) {
      ndc.set(x, y);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        target.set(hit.x, hit.z);
        pointerActive = true;
        lastMove = elapsed;
      }
    },
    setShapes(shapes) {
      // Випадкова перестановка: точки форми набираються з усього рельєфу.
      const order = Array.from({ length: count }, (_, i) => i);
      for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j]!, order[i]!];
      }
      targets = [];
      shapes.slice(0, MAX_SHAPES).forEach((shape, slot) => {
        const el = document.querySelector(`svg[data-point-shape="${shape.name}"]`);
        if (!el) return;
        targets.push({ el, slot });
        const data = emptyShape();
        const n = Math.min(shape.count, count);
        // Якщо точок форми більше, ніж є, — беремо рівномірну підвибірку.
        for (let i = 0; i < n; i++) {
          const src = Math.floor((i * shape.count) / n) * 3;
          const dst = order[i]! * 3;
          data[dst] = shape.points[src]!;
          data[dst + 1] = shape.points[src + 1]!;
          data[dst + 2] = shape.points[src + 2]!;
        }
        const attr = geometry.getAttribute(`aShape${slot}`) as THREE.BufferAttribute;
        (attr.array as Float32Array).set(data);
        attr.needsUpdate = true;
      });
    },
    resize,
    dispose() {
      cancelAnimationFrame(frame);
      running = false;
      timer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
