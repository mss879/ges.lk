"use client";

import { useEffect, useRef } from "react";

/**
 * WebGLBackground
 * A lightweight, dependency-free raw-WebGL animated background.
 * Renders a flowing aurora of brand greens using layered value-noise (FBM)
 * in a fullscreen-triangle fragment shader. Used as a premium ambient
 * backdrop behind hero / feature sections across the GES site.
 *
 * - Respects prefers-reduced-motion (renders a single static frame).
 * - Pauses when scrolled out of view (IntersectionObserver).
 * - Handles devicePixelRatio, resize, and WebGL context loss gracefully.
 */

type Variant = "dark" | "light";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uMode;   // 1.0 = dark, 0.0 = light

// --- value noise -------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = m * p;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  float t = uTime * 0.04;

  // domain-warped fbm for flowing aurora ribbons
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.15 * t),
                fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.12 * t));
  float f = fbm(p + 2.2 * r);

  // brand palette
  vec3 deep   = vec3(0.0039, 0.0941, 0.0627); // #012716
  vec3 green  = vec3(0.0,    0.6745, 0.3058);  // #00AC4E
  vec3 lime   = vec3(0.886,  1.0,    0.227);   // #e2ff3a
  vec3 teal   = vec3(0.027,  0.247,  0.141);

  vec3 col;
  if (uMode > 0.5) {
    // dark variant: rich aurora over deep forest
    col = mix(deep, teal, smoothstep(0.1, 0.7, f));
    col = mix(col, green, smoothstep(0.45, 0.95, f) * (0.55 + 0.45 * q.x));
    col += lime * pow(smoothstep(0.78, 1.0, f), 3.0) * 0.18;
    col += green * 0.06 * r.y;
  } else {
    // light variant: faint green mist over near-white
    vec3 base = vec3(0.972, 0.976, 0.980); // #f8f9fa
    float glow = smoothstep(0.35, 1.0, f);
    col = mix(base, mix(base, green, 0.10), glow);
    col = mix(col, mix(base, lime, 0.05), pow(smoothstep(0.8, 1.0, f), 2.0));
  }

  // subtle vignette
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col *= mix(0.85, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLBackground({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // fullscreen triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMode = gl.getUniformLocation(program, "uMode");
    gl.uniform1f(uMode, variant === "dark" ? 1.0 : 0.0);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const W = Math.max(1, Math.floor(w * dpr));
      const H = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const render = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = visible ? requestAnimationFrame(render) : 0;
    };

    if (reduceMotion) {
      gl.uniform1f(uTime, 8.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(render);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf && !reduceMotion) raf = requestAnimationFrame(render);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
