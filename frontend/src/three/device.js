/**
 * Device & WebGL capability detection for adaptive 3D loading.
 * Ensures smooth performance on low-power, low-memory devices and mobile phones.
 */

export function checkWebGLSupport() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function isLowPowerDevice() {
  if (typeof window === 'undefined') return false;

  // Check user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return true;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  if (cores < 4) return true;

  // Check device memory (GB of RAM, if supported in Chromium)
  const memory = navigator.deviceMemory || 4;
  if (memory < 4) return true;

  // Check small screen mobile with low DPR
  const isMobile = window.innerWidth < 640;
  if (isMobile && (cores <= 4 || memory <= 3)) return true;

  return false;
}
