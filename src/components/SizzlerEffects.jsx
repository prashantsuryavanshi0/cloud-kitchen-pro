import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const smokeVertex = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aAlpha;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float life = fract(aSeed + uTime * aSpeed);
    vec3 p = position;
    float swirl = sin(life * 9.0 + aSeed * 31.0) * 0.12 + sin(life * 17.0 + aSeed * 13.0) * 0.045;
    p.x += swirl * (0.35 + life);
    p.y += life * (1.25 + aSpeed * 2.8);
    p.z += sin(life * 5.0 + aSeed * 20.0) * 0.08;
    vAlpha = sin(life * 3.14159) * aAlpha * (1.0 - life * 0.28);
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 + life * 0.72);
  }
`

const smokeFragment = `
  precision highp float;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radial = length(vec2(uv.x * 0.82, uv.y));
    float turbulence = sin((uv.x + vSeed) * 18.0) * sin((uv.y - vSeed) * 15.0) * 0.035;
    float body = 1.0 - smoothstep(0.12, 0.5, radial + turbulence);
    float core = 1.0 - smoothstep(0.02, 0.38, radial);
    float alpha = body * vAlpha * (0.2 + core * 0.22);
    gl_FragColor = vec4(vec3(0.76, 0.8, 0.83), alpha);
  }
`

const flameVertex = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  attribute float aSpeed;
  varying float vLife;
  varying float vSeed;
  void main() {
    float life = fract(aSeed + uTime * aSpeed);
    vec3 p = position;
    float flicker = sin(uTime * (8.0 + aSeed * 5.0) + aSeed * 30.0) * 0.055;
    p.x += flicker + sin(life * 10.0 + aSeed * 17.0) * 0.07;
    p.y += life * (0.34 + aSpeed * 0.55);
    vLife = life;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 - life * 0.48) * (0.88 + sin(uTime * 10.0 + aSeed * 40.0) * 0.12);
  }
`

const flameFragment = `
  precision highp float;
  varying float vLife;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv.x *= 1.25;
    float flame = 1.0 - smoothstep(0.12, 0.52, length(vec2(uv.x, uv.y * 0.72)));
    flame *= smoothstep(0.52, -0.26, uv.y + vLife * 0.12);
    float pulse = 0.78 + sin(vSeed * 51.0 + vLife * 12.0) * 0.22;
    vec3 red = vec3(0.98, 0.12, 0.015);
    vec3 orange = vec3(1.0, 0.42, 0.025);
    vec3 gold = vec3(1.0, 0.92, 0.36);
    vec3 color = mix(red, orange, smoothstep(0.0, 0.58, 1.0 - vLife));
    color = mix(color, gold, flame * (1.0 - vLife) * 0.72);
    gl_FragColor = vec4(color, flame * pulse * (1.0 - vLife * 0.5));
  }
`

const emberVertex = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aSpeed;
  varying float vLife;
  void main() {
    float life = fract(aSeed + uTime * aSpeed);
    vec3 p = position;
    p.x += sin(life * 13.0 + aSeed * 44.0) * (0.08 + life * 0.24);
    p.y += life * (0.72 + aSpeed);
    vLife = life;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.0 + mod(aSeed * 100.0, 3.0)) * uPixelRatio * (1.0 - life * 0.55);
  }
`

const emberFragment = `
  precision highp float;
  varying float vLife;
  void main() {
    float glow = 1.0 - smoothstep(0.05, 0.5, length(gl_PointCoord - 0.5));
    vec3 color = mix(vec3(1.0, 0.18, 0.01), vec3(1.0, 0.9, 0.3), 1.0 - vLife);
    gl_FragColor = vec4(color, glow * sin(vLife * 3.14159));
  }
`

function makeGeometry(count, kind) {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const seeds = new Float32Array(count)
  const speeds = new Float32Array(count)
  const alphas = new Float32Array(count)

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3
    const seed = (index * 0.61803398875) % 1
    seeds[index] = seed
    positions[offset] = (seed - 0.5) * (kind === 'smoke' ? 0.92 : 1.45)
    positions[offset + 1] = kind === 'smoke' ? -0.22 + (index % 4) * 0.035 : -0.68 + (index % 3) * 0.025
    positions[offset + 2] = (index % 5) * 0.01
    sizes[index] = kind === 'smoke' ? 58 + (index % 7) * 11 : 38 + (index % 5) * 8
    speeds[index] = kind === 'smoke' ? 0.055 + (index % 6) * 0.009 : 0.14 + (index % 7) * 0.018
    alphas[index] = 0.5 + (index % 5) * 0.08
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  if (kind !== 'ember') geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  if (kind === 'smoke') geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  return geometry
}

export default function SizzlerEffects() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const mobile = window.matchMedia('(max-width: 768px)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 2

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance', premultipliedAlpha: true })
    } catch {
      host.dataset.webgl = 'unavailable'
      return undefined
    }

    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.6)
    const smokeUniforms = { uTime: { value: 0 }, uPixelRatio: { value: ratio } }
    const flameUniforms = { uTime: { value: 0 }, uPixelRatio: { value: ratio } }
    const emberUniforms = { uTime: { value: 0 }, uPixelRatio: { value: ratio } }

    const smoke = new THREE.Points(makeGeometry(mobile ? 18 : 32, 'smoke'), new THREE.ShaderMaterial({ vertexShader: smokeVertex, fragmentShader: smokeFragment, uniforms: smokeUniforms, transparent: true, depthWrite: false, blending: THREE.NormalBlending }))
    const flames = new THREE.Points(makeGeometry(mobile ? 16 : 28, 'flame'), new THREE.ShaderMaterial({ vertexShader: flameVertex, fragmentShader: flameFragment, uniforms: flameUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    const embers = new THREE.Points(makeGeometry(mobile ? 20 : 42, 'ember'), new THREE.ShaderMaterial({ vertexShader: emberVertex, fragmentShader: emberFragment, uniforms: emberUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    flames.renderOrder = 1
    smoke.renderOrder = 2
    embers.renderOrder = 3
    scene.add(flames, smoke, embers)

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      const safeHeight = Math.max(height, 1)
      const aspect = width / safeHeight
      camera.left = -aspect
      camera.right = aspect
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(ratio)
      renderer.setSize(width, safeHeight, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()

    let frame = 0
    let active = true
    const clock = new THREE.Clock()
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting }, { threshold: 0.05 })
    observer.observe(host)

    const render = () => {
      frame = window.requestAnimationFrame(render)
      if (!active || document.hidden) return
      const time = clock.getElapsedTime() * (reducedMotion ? 0.22 : 1)
      smokeUniforms.uTime.value = time
      flameUniforms.uTime.value = time
      emberUniforms.uTime.value = time
      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      scene.remove(flames, smoke, embers)
      smoke.geometry.dispose()
      smoke.material.dispose()
      flames.geometry.dispose()
      flames.material.dispose()
      embers.geometry.dispose()
      embers.material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="sizzler-webgl" aria-hidden="true" />
}
