import * as THREE from "three";

// Рельєф із точок: сітка хвилюється шумом, під курсором розходиться бурштинова хвиля.
// Модуль вантажиться динамічно (import()), тому Three.js не потрапляє в основний бандл.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uSize;

  varying float vGlow;
  varying float vFade;

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

  void main() {
    vec3 p = position;

    // Повільний рельєф: два шари шуму.
    float t = uTime * 0.12;
    float h = snoise(p.xz * 0.18 + vec2(t, t * 0.6)) * 0.55
            + snoise(p.xz * 0.45 - vec2(t * 0.8, 0.0)) * 0.18;

    // Хвиля від курсора.
    float d = distance(p.xz, uMouse);
    float ripple = sin(d * 3.2 - uTime * 3.0) * exp(-d * 0.55) * uMouseStrength;
    p.y += h + ripple * 0.35;

    vGlow = clamp(exp(-d * 0.65) * uMouseStrength + smoothstep(0.35, 0.9, h) * 0.55, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Туман до горизонту і згасання по краях.
    vFade = smoothstep(-26.0, -6.0, mv.z) * (1.0 - smoothstep(9.0, 15.0, abs(p.x)));
    gl_PointSize = uSize * uPixelRatio * (1.0 + vGlow * 1.2) * (8.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;

  varying float vGlow;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, r);
    vec3 color = mix(uBase, uAccent, vGlow);
    float alpha = soft * vFade * mix(0.55, 1.0, vGlow);
    gl_FragColor = vec4(color, alpha);
  }
`;

export type TerrainScene = {
  compile: () => Promise<void>; // шейдери без блокування потоку (KHR_parallel_shader_compile)
  start: () => void;
  stop: () => void;
  setPointer: (x: number, y: number) => void; // NDC −1…1
  resize: () => void;
  dispose: () => void;
};

type Options = { canvas: HTMLCanvasElement; accent: string; animate: boolean; dense: boolean };

export function createTerrainScene({ canvas, accent, animate, dense }: Options): TerrainScene {
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

  // Сітка точок у площині XZ.
  const cols = dense ? 240 : 110;
  const rows = dense ? 150 : 70;
  const width = 30;
  const depth = 26;
  const positions = new Float32Array(cols * rows * 3);
  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < cols; x++) {
      const i = (z * cols + x) * 3;
      positions[i] = (x / (cols - 1) - 0.5) * width;
      positions[i + 1] = 0;
      positions[i + 2] = -(z / (rows - 1)) * depth + 4;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseStrength: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: dense ? 2.8 : 3.2 },
    uBase: { value: new THREE.Color("#8a8b90") },
    uAccent: { value: new THREE.Color(accent) },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Курсор: проєкція на площину y = 0.
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const target = new THREE.Vector2(99, 99);
  let pointerActive = false;
  let lastMove = 0;

  // Власний лічильник часу: після паузи (вкладка/поза екраном) без стрибка.
  const timer = new THREE.Timer();
  let elapsed = 0;
  let frame = 0;
  let running = false;
  let compiled = false; // до compileAsync не малюємо, інакше шейдери компілюються синхронно

  const render = () => {
    timer.update();
    const t = (elapsed += Math.min(timer.getDelta(), 0.1));
    uniforms.uTime.value = t;

    // Плавне наближення хвилі до курсора і згасання, якщо миша стоїть.
    const idle = t - lastMove > 2.5;
    const strength = pointerActive && !idle ? 1 : 0;
    uniforms.uMouseStrength.value += (strength - uniforms.uMouseStrength.value) * 0.05;
    uniforms.uMouse.value.lerp(target, 0.08);

    // Легкий паралакс камери за курсором.
    camera.position.x += (baseCamera.x + ndc.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (baseCamera.y + ndc.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, -0.2, -4);

    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    frame = requestAnimationFrame(loop);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // На вузьких екранах відсуваємо камеру, щоб рельєф не був надто крупним.
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
      if (running || !animate) {
        render();
        return;
      }
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
