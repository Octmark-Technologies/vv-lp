"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A render turned into a 3D scene (img2threejs, projection-first route), any aspect ratio.
 *
 * The client's render is the surface (its own pixels, never repainted). Depth comes from a
 * Depth Anything V2 pass with edge-aware guided upsampling (R channel: 0 far → 1 near). Every
 * vertex sits on its own camera ray, so at the reference pose the mesh projects pixel-for-pixel
 * onto the original render; the building never changes shape. Small camera moves reveal real
 * parallax between the balcony, the people and the city behind.
 */
export type Photo3DPose = { x: number; y: number; z: number; zoom: number; dim: number };

const vertex = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uHalfTanX;
  uniform float uHalfTanY;
  uniform float uD;
  uniform float uGain;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float disp = texture2D(uDepth, uv).r;
    float depth = uD * (1.0 - uGain * disp);
    vec3 ray = vec3((uv.x - 0.5) * 2.0 * uHalfTanX, (uv.y - 0.5) * 2.0 * uHalfTanY, -1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(ray * depth, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform sampler2D uColor;
  uniform float uDim;
  varying vec2 vUv;
  void main() {
    vec3 c = texture2D(uColor, vUv).rgb;
    gl_FragColor = vec4(c * (1.0 - uDim), 1.0);
    #include <colorspace_fragment>
  }
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Photo3D({
  color,
  colorPhone,
  depth,
  aspect,
  getPose,
  className,
  onReady,
  halfTanY = Math.tan(THREE.MathUtils.degToRad(20)),
  distance = 10,
  gain = 0.55,
}: {
  color: string;
  colorPhone?: string;
  depth: string;
  /** width / height of the render */
  aspect: number;
  getPose: () => Photo3DPose;
  className?: string;
  onReady?: () => void;
  halfTanY?: number;
  distance?: number;
  gain?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const halfTanX = halfTanY * aspect;
    const uniforms = {
      uColor: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uHalfTanX: { value: halfTanX },
      uHalfTanY: { value: halfTanY },
      uD: { value: distance },
      uGain: { value: gain },
      uDim: { value: 0 },
    };
    const phone = window.innerWidth < 900;
    const segX = phone ? 240 : 400;
    const geo = new THREE.PlaneGeometry(1, 1, segX, Math.round(segX / aspect));
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    const target = new THREE.Vector3(0, 0, -distance * (1 - gain * 0.6));
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const setTex = (t: THREE.Texture, isDepth = false) => {
      t.colorSpace = isDepth ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      t.anisotropy = isDepth ? 1 : maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.needsUpdate = true;
    };
    const loader = new THREE.TextureLoader();
    let ready = 0;
    const markReady = () => {
      if (++ready === 2) {
        onReady?.();
        draw(true);
      }
    };
    loader.load(depth, (t) => {
      if (disposed) return t.dispose();
      setTex(t, true);
      uniforms.uDepth.value = t;
      markReady();
    });
    loader.load(phone && colorPhone ? colorPhone : color, (t) => {
      if (disposed) return t.dispose();
      setTex(t);
      uniforms.uColor.value = t;
      markReady();
    });

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

    const cur: Photo3DPose = { ...getPose() };
    let last = "";
    let raf = 0;
    function draw(force = false) {
      if (!uniforms.uColor.value || !uniforms.uDepth.value) return;
      const s = getPose();
      const k = force && !last ? 1 : 0.12;
      (Object.keys(cur) as (keyof Photo3DPose)[]).forEach((key) => (cur[key] = lerp(cur[key], s[key], k)));
      // cover the canvas with the render: vertical half-fov from whichever side is the limiting one
      const a = w / h;
      const halfV = a >= aspect ? (halfTanY * aspect) / a : halfTanY;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfV / cur.zoom));
      camera.position.set(cur.x * distance, cur.y * distance, -cur.z * distance);
      camera.lookAt(target.x + cur.x * distance * 0.3, target.y + cur.y * distance * 0.3, target.z);
      camera.updateProjectionMatrix();
      uniforms.uDim.value = cur.dim;
      const sig = [cur.x, cur.y, cur.z, cur.zoom, cur.dim, w, h].map((v) => v.toFixed(4)).join();
      if (force || sig !== last) renderer.render(scene, camera);
      last = sig;
    }
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
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
