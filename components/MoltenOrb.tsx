"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointerState } from "@/lib/pointer";

/**
 * The molten core.
 *
 * The surface is a real-time GLSL material: several noise fields are sampled in
 * a slowly rotating domain and layered into convection bands, thin fissures and
 * cool crust patches. The result is shaded with its own key / fill / rim rig so
 * the sphere keeps volume and material weight instead of reading as a flat
 * emissive ball.
 */
const coreVertexShader = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vWorldNormal;
  varying vec3 vView;
  varying vec3 vWorldPos;

  void main() {
    vLocal = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const coreFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uPointer;

  varying vec3 vLocal;
  varying vec3 vWorldNormal;
  varying vec3 vView;
  varying vec3 vWorldPos;

  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec3(1.0, 0.0, 0.0));
    float c = hash(i + vec3(0.0, 1.0, 0.0));
    float d = hash(i + vec3(1.0, 1.0, 0.0));
    float e = hash(i + vec3(0.0, 0.0, 1.0));
    float f2 = hash(i + vec3(1.0, 0.0, 1.0));
    float g = hash(i + vec3(0.0, 1.0, 1.0));
    float h = hash(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
      mix(mix(e, f2, f.x), mix(g, h, f.x), f.y),
      f.z
    );
  }

  // Rotated-octave fbm keeps the veins from looking grid-aligned.
  // Three octaves is the sweet spot: the fourth and fifth only added sub-pixel
  // grain while roughly doubling the noise samples per fragment.
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat3 octave = mat3(
      0.80, -0.60, 0.20,
      0.60, 0.80, -0.10,
      -0.20, 0.10, 0.98
    );
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p = octave * p * 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float fbm4(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat3 octave = mat3(
      0.80, -0.60, 0.20,
      0.60, 0.80, -0.10,
      -0.20, 0.10, 0.98
    );
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = octave * p * 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  // Ridged noise produces thin bright fissures rather than blobs.
  float ridged(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
      value += amplitude * n * n;
      p *= 2.13;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 rotateY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
  }

  vec3 rotateX(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 view = normalize(vView);
    vec3 p = normalize(vLocal);

    // Slowly swirling sample domain so the material flows rather than spins.
    vec3 q = rotateY(p, uTime * 0.042 + uPointer.x * 0.22);
    q = rotateX(q, uTime * 0.017 - uPointer.y * 0.16);
    q *= 2.35;

    // Domain warp gives the bands their organic, folded structure.
    vec3 warp = vec3(
      fbm(q * 0.75 + vec3(0.0, 1.7, 0.0)),
      fbm(q * 0.75 + vec3(2.4, 0.0, 1.3)),
      fbm(q * 0.75 + vec3(-1.4, 0.4, 0.0))
    );
    vec3 flow = q + (warp - 0.5) * 1.85;

    float band = sin(flow.y * 2.05 + fbm4(flow * 1.45) * 3.6);
    float fissure = ridged(flow * 2.7 + vec3(0.0, uTime * 0.055, uTime * 0.02));
    float crust = fbm(flow * 4.7 - vec3(uTime * 0.04));
    float emberField = fbm(flow * 1.15 + vec3(uTime * 0.03, -uTime * 0.02, 0.0));

    // Heat is highest where the convection bands fold against the ember field.
    // The thresholds keep roughly a third of the surface as cold, near-black
    // crust so the molten regions read as something glowing through it.
    float heat = smoothstep(-0.30, 1.10, band * 0.86 + (emberField - 0.56) * 1.70);
    float glow = smoothstep(0.62, 1.0, fissure * (1.02 - heat * 0.30));
    float cool = smoothstep(0.50, 0.95, crust + (1.0 - heat) * 0.34);

    vec3 crustColor = vec3(0.013, 0.011, 0.010);
    vec3 emberColor = vec3(0.215, 0.034, 0.005);
    vec3 moltenColor = vec3(1.000, 0.235, 0.015);
    vec3 amberColor = vec3(1.000, 0.615, 0.215);
    vec3 coreColor = vec3(1.000, 0.910, 0.780);
    vec3 incandescent = vec3(1.000, 0.570, 0.400);

    vec3 albedo = crustColor;
    albedo = mix(albedo, emberColor, heat * 0.90);
    albedo = mix(albedo, moltenColor, pow(heat, 1.70));
    // Incandescent centres where the heat field peaks.
    albedo = mix(albedo, incandescent, smoothstep(0.86, 1.0, heat) * 0.85);
    albedo = mix(albedo, amberColor, glow * 0.68);
    albedo = mix(albedo, coreColor, pow(glow, 3.4) * 0.40);
    albedo = mix(albedo, crustColor * 0.40, cool * 0.78);

    // Studio lighting rig built into the material.
    vec3 keyDir = normalize(vec3(-0.58, 0.72, 0.66));
    vec3 fillDir = normalize(vec3(0.85, -0.30, 0.44));
    float ndv = max(dot(normal, view), 0.0);
    float key = max(dot(normal, keyDir), 0.0);
    float fill = max(dot(normal, fillDir), 0.0);
    float keySpec = pow(max(dot(normal, normalize(keyDir + view)), 0.0), 320.0);
    float fillSpec = pow(max(dot(normal, normalize(fillDir + view)), 0.0), 30.0);
    float rim = pow(1.0 - ndv, 3.2);
    float fresnel = pow(1.0 - ndv, 5.0);
    float keyFall = pow(key, 1.5);

    vec3 color = albedo * (0.11 + keyFall * 0.62 + fill * 0.20);
    color += vec3(1.0, 0.86, 0.68) * keySpec * 0.70;
    color += vec3(1.0, 0.55, 0.22) * fillSpec * 0.20;
    color += vec3(1.0, 0.40, 0.09) * rim * 0.46;
    color += vec3(1.0, 0.68, 0.34) * fresnel * 0.14;
    // Self-illumination: molten regions light themselves.
    color += albedo * pow(heat, 2.6) * 0.70;
    color += vec3(1.0, 0.60, 0.22) * pow(glow, 2.0) * 0.22;

    // Soft contact falloff so the underside settles into the dark.
    float underside = smoothstep(-0.85, 0.15, normal.y + 0.25 * view.y);
    color *= 0.58 + 0.42 * underside;
    // Cold crust sits a touch darker than the hot regions.
    color *= 1.0 - cool * 0.22;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Soft additive halo that reads as warm atmosphere around the sphere. */
const haloVertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vView;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const haloFragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vWorldNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vWorldNormal), normalize(vView))), 2.6);
    gl_FragColor = vec4(vec3(1.0, 0.42, 0.12) * rim * 0.62, rim * 0.55);
  }
`;

type Uniforms = {
  uTime: { value: number };
  uPointer: { value: THREE.Vector2 };
};

export default function MoltenOrb() {
  const group = useRef<THREE.Group>(null);
  const coreMaterial = useRef<THREE.ShaderMaterial>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);

  const uniforms = useMemo<Uniforms>(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) }
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const step = Math.min(delta, 1 / 30);

    if (coreMaterial.current) {
      const target = coreMaterial.current.uniforms as unknown as Uniforms;
      target.uTime.value = elapsed;
      // The GPU layer only follows a small fraction of the pointer travel.
      target.uPointer.value.x +=
        (pointerState.x * 0.55 - target.uPointer.value.x) * Math.min(1, step * 1.6);
      target.uPointer.value.y +=
        (pointerState.y * 0.35 - target.uPointer.value.y) * Math.min(1, step * 1.6);
    }

    // Organic drift: two irrational-ish frequencies never visibly loop.
    if (group.current) {
      group.current.rotation.y = Math.sin(elapsed * 0.115) * 0.085 + elapsed * 0.012;
      group.current.rotation.x = Math.cos(elapsed * 0.088) * 0.05;
      group.current.rotation.z = Math.sin(elapsed * 0.061) * 0.022;
    }

    if (ringMaterial.current) {
      ringMaterial.current.opacity = 0.26 + Math.sin(elapsed * 0.5) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.16, 160, 160]} />
        <shaderMaterial
          ref={coreMaterial}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={uniforms}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry args={[1.16, 64, 64]} />
        <shaderMaterial
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Orbital ring that passes in front of the sphere, anchoring it in space. */}
      <mesh rotation={[Math.PI * 0.42, 0.2, -0.32]} scale={[2.0, 2.0, 2.0]}>
        <torusGeometry args={[1.0, 0.0016, 3, 220]} />
        <meshBasicMaterial
          ref={ringMaterial}
          color="#ff7a2a"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI * 0.58, -0.35, 0.5]} scale={[2.32, 2.32, 2.32]}>
        <torusGeometry args={[1.0, 0.0012, 3, 220]} />
        <meshBasicMaterial
          color="#ffbe8a"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
