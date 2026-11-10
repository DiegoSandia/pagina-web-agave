'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec4 a_seed;
uniform float u_time;
uniform float u_dpr;
varying float v_alpha;
varying float v_hue;
void main() {
  float life = fract(u_time * a_seed.y + a_seed.w);
  float x = a_seed.x * 2.0 - 1.0
    + sin(u_time * 0.55 + a_seed.w * 12.0) * 0.07
    + sin(u_time * 1.9 + a_seed.w * 40.0) * 0.012
    + life * 0.16;
  float y = -1.1 + life * 2.35;
  gl_Position = vec4(x, y, 0.0, 1.0);
  gl_PointSize = a_seed.z * u_dpr * (1.0 - life * 0.65);
  v_alpha = smoothstep(0.0, 0.1, life) * (1.0 - smoothstep(0.5, 1.0, life));
  v_hue = fract(a_seed.w * 7.31);
}`;

const FRAG = `
precision mediump float;
uniform float u_time;
varying float v_alpha;
varying float v_hue;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float glow = pow(smoothstep(0.5, 0.0, d), 2.4);
  vec3 col = mix(vec3(1.0, 0.74, 0.12), vec3(1.0, 0.30, 0.04), v_hue);
  float flicker = 0.72 + 0.28 * sin(u_time * 8.0 + v_hue * 60.0);
  float a = glow * v_alpha * flicker;
  gl_FragColor = vec4(col * a, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function Embers({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const count = Math.round((mobile ? 55 : 120) * density);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const bokeh = Math.random() < 0.12;
      seeds[i * 4] = Math.pow(Math.random(), 0.7);
      seeds[i * 4 + 1] = 0.045 + Math.random() * 0.09;
      seeds[i * 4 + 2] = bokeh ? 14 + Math.random() * 16 : 2 + Math.random() * 5;
      seeds[i * 4 + 3] = Math.random();
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_seed');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uDpr = gl.getUniformLocation(prog, 'u_dpr');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [density]);

  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
