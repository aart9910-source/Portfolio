"use client";

import { Canvas } from "@react-three/fiber";
import MoltenOrb from "./MoltenOrb";

/**
 * The WebGL layer of the hero.
 *
 * Mounted only after the hero copy has painted and only when the stage is near
 * the viewport, so the first meaningful render never waits on the GPU. All
 * lighting lives inside the orb material, which keeps the scene free of extra
 * draw calls.
 */
export default function OrbCanvas() {
  return (
    <Canvas
      className="orb-canvas"
      camera={{ position: [0, 0, 4.1], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false
      }}
      flat
      style={{ pointerEvents: "none" }}
    >
      <MoltenOrb />
    </Canvas>
  );
}
