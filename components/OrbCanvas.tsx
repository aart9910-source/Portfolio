"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MoltenOrb from "./MoltenOrb";

export default function OrbCanvas() {
  return (
    <Canvas
      className="orb-canvas"
      camera={{ position: [0, 0, 4.05], fov: 39 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      fallback={<div className="orb-fallback" aria-hidden="true" />}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#ffd7ac" />
        <pointLight position={[1.8, -0.8, 2]} intensity={3.8} color="#ff4f00" distance={5} />
        <MoltenOrb />
      </Suspense>
    </Canvas>
  );
}
