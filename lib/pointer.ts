/**
 * A tiny module-level pointer store.
 *
 * The hero's WebGL scene runs inside its own react-three-fiber reconciler, so
 * React context from the DOM tree cannot reach it. A shared mutable store lets
 * both the DOM layers and the GPU layers read the same normalised pointer value
 * without triggering React re-renders on every mouse move.
 */
export type PointerRead = { x: number; y: number; hasMoved: boolean };

export const pointerState: PointerRead = { x: 0, y: 0, hasMoved: false };

/** Normalised coordinates: -0.5 (left/top) → 0.5 (right/bottom). */
export function writePointer(x: number, y: number) {
  pointerState.x = x;
  pointerState.y = y;
  pointerState.hasMoved = true;
}

export function clearPointer() {
  pointerState.hasMoved = false;
}

export function isReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True for devices with a real pointing device (mouse / trackpad / stylus). */
export function hasPrecisePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}
