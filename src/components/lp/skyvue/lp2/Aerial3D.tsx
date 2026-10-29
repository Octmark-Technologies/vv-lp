"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * SkyVue aerial in 3D (img2threejs, projection-first route).
 *
 * The client's 6K aerial render ("Aerial_One 6k") is the surface: its own pixels are put on a
 * mesh, never repainted. The mesh comes from a monocular depth pass (Depth Anything V2, ViT-S,
 * edge-aware guided upsampling) over the same render. Every vertex is placed ALONG ITS OWN
 * CAMERA RAY, so from the reference camera the model projects pixel-for-pixel onto the original
 * render: the elevation cannot change. Moving the camera a little then reveals real parallax
 * between the towers, the podium and the forest. Camera travel is kept small on purpose: a single
 * view cannot show the hidden sides, so we never orbit far enough to need them.
 *
 * Textures: 4096² WebP on desktop, 2048² on phones (the 2400² page image is the instant poster).
 * Depth map: R = disparity (0 far → 1 near), G = tower mask (for the "your block" highlight).
 */

export type AerialPose = {
  /** camera offset from the reference camera, as a fraction of the scene distance */
  x: number;
  y: number;
  z: number;
  /** extra zoom (1 = reference framing) */
  zoom: number;
};

export type AerialState = AerialPose & {
  /** construction line sweeping up the towers, 0 (base) → 1 (top); <0 hides it */
  band: number;
  /** orange tint on the towers, 0..1 */
  glow: number;
  /** darken everything that is not a tower, 0..1 */
  focus: number;
};

const TEX_DESKTOP = "/lp/skyvue/3d/aerial-4096.webp";
const TEX_PHONE = "/lp/skyvue/3d/aerial-2048.webp";
const DEPTH = "/lp/skyvue/3d/aerial-depth.png";

// Reference camera: the render is square; HALF_TAN is tan(fov/2) of the reconstruction.
const HALF_TAN = Math.tan(THREE.MathUtils.degToRad(24));
const D = 10; // distance of the farthest point (forest at the top of the frame)
const NEAR_GAIN = 0.42; // nearest point (tower roofs) sits at D * (1 - NEAR_GAIN)

const vertex = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uHalfTan;
  uniform float uD;
  uniform float uGain;
  varying vec2 vUv;
  varying float vMask;
  void main() {
    vUv = uv;
    vec4 dm = texture2D(uDepth, uv);
    vMask = dm.g;
    float depth = uD * (1.0 - uGain * dm.r);
    // the ray through this pixel of the reference camera (looking down -Z)
    vec3 ray = vec3((uv.x - 0.5) * 2.0 * uHalfTan, (uv.y - 0.5) * 2.0 * uHalfTan, -1.0);
    vec3 p = ray * depth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uColor;
  uniform float uBand;
  uniform float uGlow;
  uniform float uFocus;
  varying vec2 vUv;
  varying float vMask;
  void main() {
    vec4 c = texture2D(uColor, vUv);
    vec3 col = c.rgb;
    float m = smoothstep(0.35, 0.9, vMask);
    // focus: quietly darken the forest and roads so the towers lead
    col *= mix(1.0, 0.42, uFocus * (1.0 - m));
    // "your block": warm the towers a touch
    col = mix(col, col * vec3(1.18, 0.92, 0.78) + vec3(0.09, 0.03, 0.0), uGlow * m * 0.6);
    // construction line: a thin orange line rising up the towers
    if (uBand >= 0.0) {
      float y = mix(0.30, 0.86, uBand);
      float line = exp(-pow((vUv.y - y) / 0.0032, 2.0));
      float below = smoothstep(y + 0.002, y - 0.06, vUv.y) * 0.18;
      col = mix(col, vec3(0.947, 0.085, 0.0), m * clamp(line + below * 0.0, 0.0, 1.0));
      col += vec3(0.947, 0.085, 0.0) * m * below * 0.35;
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Aerial3D({ getState, className, onReady }: { getState: () => AerialState; className?: string; onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);

    const loader = new THREE.TextureLoader();
    const phone = window.innerWidth < 900;
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const uniforms = {
      uColor: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uHalfTan: { value: HALF_TAN },
      uD: { value: D },
      uGain: { value: NEAR_GAIN },
      uBand: { value: -1 },
      uGlow: { value: 0 },
      uFocus: { value: 0 },
    };
    const seg = phone ? 256 : 420;
    const geo = new THREE.PlaneGeometry(1, 1, seg, seg); // positions are rebuilt on the GPU from uv
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);

    // Where the camera looks: straight ahead at tower depth (so the reference pose is exact).
    const target = new THREE.Vector3(0, 0, -D * (1 - NEAR_GAIN * 0.8));

    const setTex = (t: THREE.Texture, depth = false) => {
      t.colorSpace = depth ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      t.anisotropy = depth ? 1 : maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    };

    let ready = 0;
    const markReady = () => {
      ready++;
      if (ready === 2) {
        onReady?.();
        draw(true);
      }
    };
    loader.load(DEPTH, (t) => {
      if (disposed) return t.dispose();
      setTex(t, true);
      uniforms.uDepth.value = t;
      markReady();
    });
    // Poster first (already cached by the page), then the full-resolution surface.
    loader.load("/lp/skyvue/fr/aerial.webp", (t) => {
      if (disposed) return t.dispose();
      setTex(t);
      if (!uniforms.uColor.value) {
        uniforms.uColor.value = t;
        markReady();
      }
      loader.load(phone ? TEX_PHONE : TEX_DESKTOP, (hi) => {
        if (disposed) return hi.dispose();
        setTex(hi);
        const old = uniforms.uColor.value;
        uniforms.uColor.value = hi;
        if (old && old !== hi) old.dispose();
        draw(true);
      });
    });

    // Fit: the reference framing covers the canvas (like object-fit: cover), centred on the towers.
    let w = 1;
    let h = 1;
    const resize = () => {
      w = el.clientWidth || 1;
      h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      draw(true);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Smoothly follow the state the page asks for (critically damped per frame).
    const cur: AerialState = { ...getState() };
    let raf = 0;
    let last = "";
    const draw = (force = false) => {
      if (!uniforms.uColor.value || !uniforms.uDepth.value) return;
      const s = getState();
      const k = force && !last ? 1 : 0.12;
      (Object.keys(cur) as (keyof AerialState)[]).forEach((key) => (cur[key] = lerp(cur[key], s[key], k)));
      // vertical fov that covers the canvas with the square reference image
      const a = w / h;
      const halfV = a >= 1 ? HALF_TAN / a : HALF_TAN;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfV / cur.zoom));
      camera.position.set(cur.x * D, cur.y * D, -cur.z * D);
      camera.lookAt(target.x + cur.x * D * 0.35, target.y + cur.y * D * 0.35, target.z);
      camera.updateProjectionMatrix();
      uniforms.uBand.value = cur.band;
      uniforms.uGlow.value = cur.glow;
      uniforms.uFocus.value = cur.focus;
      const sig = [cur.x, cur.y, cur.z, cur.zoom, cur.band, cur.glow, cur.focus, w, h].map((v) => v.toFixed(4)).join();
      if (force || sig !== last) renderer.render(scene, camera);
      last = sig;
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    // Only animate while on screen.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(el);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      uniforms.uColor.value?.dispose();
      uniforms.uDepth.value?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
