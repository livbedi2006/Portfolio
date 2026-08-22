import React, { useEffect, useRef } from 'react';
import {
  ShaderMount,
  warpFragmentShader,
  WarpPatterns,
  ShaderFitOptions,
  defaultPatternSizing,
  getShaderColorFromString,
  getShaderNoiseTexture,
} from '@paper-design/shaders';

/* Animated marbled backdrop, derived from the reference clip.
 *
 * The clip is a domain-warped liquid field in saturated cyan: hue 184–204°
 * (median 195°), saturation median 0.75, luminance ranging 57→220. That hue
 * band sits exactly between the palette's Peacock (190°) and Petrol (208°),
 * so the MOTION transfers unchanged and only the range needs work.
 *
 * The range needs work because the clip is a video — it owns every pixel and
 * has no text on it. Here it sits under a whole page of copy. Compositing the
 * clip's own saturated ramp over the page colour and solving for the highest
 * opacity that keeps every text tier at its floor caps out at α ≈ 0.20–0.25,
 * which is too faint to perceive — the bright end of the ramp is what fails,
 * so dimming the layer can never fix it. Capping the ramp instead of dimming
 * the layer is what makes this shippable: the ramps below clear every floor at
 * FULL opacity, which turns --bd-opacity into a purely aesthetic dial with no
 * contrast risk left in it.
 *
 *   dark   #131a2a → #16202f → #16243a → #12304a   primary 11.0 / sec 6.8 / mut 4.5
 *   light  #f2fafa → #dcf0f0 → #c1e5e5 → #a9d8d8   primary 11.2 / sec 8.7 / mut 5.2
 *
 * (Worst case taken over EVERY ramp stop, so it holds wherever the marbling
 * happens to land behind a given paragraph.) Capping also keeps the locked
 * near-monochrome direction intact — a saturated cyan wallpaper would have
 * contradicted it even if the numbers had passed.
 *
 * Colours are read from CSS custom properties rather than hardcoded so the
 * backdrop flips with the theme. It reads the RAW theme vars (--bd-*), not
 * Tailwind's --color-* aliases: `@theme inline` compiles those into utility
 * declarations and never emits them onto :root, so getComputedStyle returns
 * empty for them and the fallback would silently stick forever.
 */

const FALLBACK = ['#131a2a', '#16202f', '#16243a', '#12304a'];
const VARS = ['--bd-0', '--bd-1', '--bd-2', '--bd-3'];

function readRamp() {
  const cs = getComputedStyle(document.documentElement);
  return VARS.map((v, i) => cs.getPropertyValue(v).trim() || FALLBACK[i]);
}

/* Slow enough to read as drift rather than animation — the source clip is
 * 0.81s of barely-moving fluid, and a background that competes for attention
 * is a background that failed. */
const SPEED = 0.16;

export default function LiquidBackdrop() {
  const hostRef = useRef(null);
  const mountRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ramp = readRamp();

    let mount;
    try {
      mount = new ShaderMount(
        host,
        warpFragmentShader,
        {
          ...defaultPatternSizing,
          u_fit: ShaderFitOptions[defaultPatternSizing.fit],
          u_scale: 0.55,

          u_colors: ramp.map((c) => getShaderColorFromString(c)),
          u_colorsCount: ramp.length,
          u_proportion: 0.5,
          /* softness 1 + a tiny shapeScale dissolves warp's base pattern
             entirely, which is what leaves pure marbling behind — the clip
             shows no repeating geometry anywhere. */
          u_softness: 1,
          u_shape: WarpPatterns.checks,
          u_shapeScale: 0.08,
          u_distortion: 0.26,
          u_swirl: 0.85,
          u_swirlIterations: 10,
          u_noiseTexture: getShaderNoiseTexture(),
        },
        undefined,
        motionQuery.matches ? 0 : SPEED,
        0,
        1,
        /* Default is 1920*1080*2 ≈ 8.3M pixels. An edge-free soft field
           upscales invisibly, and this page already runs a second WebGL
           context in the playground, so buy the cheap version. */
        1280 * 720 * 1.5
      );
      mountRef.current = mount;
    } catch (err) {
      /* No WebGL (old GPU, blocklisted driver, headless) — the page still has
         its opaque base colour underneath, so failing here costs decoration
         and nothing else. */
      console.warn('[LiquidBackdrop] shader unavailable, falling back to flat background', err);
      return;
    }

    /* Theme flip → re-read the tokens. Two triggers, because there are two
       ways the palette can change: the toggle sets data-theme on <html>, and
       a visitor who has never touched the toggle is still following the OS,
       where nothing in the DOM changes at all. */
    const onTheme = () => {
      const next = readRamp();
      mount.setUniforms({
        u_colors: next.map((c) => getShaderColorFromString(c)),
        u_colorsCount: next.length,
      });
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const osQuery = window.matchMedia('(prefers-color-scheme: light)');
    osQuery.addEventListener('change', onTheme);

    /* Reduced-motion is a live setting, not a load-time one. Freezing to
       speed 0 keeps the texture — it just stops moving. */
    const onMotion = () => mount.setSpeed(motionQuery.matches ? 0 : SPEED);
    motionQuery.addEventListener('change', onMotion);

    return () => {
      mo.disconnect();
      osQuery.removeEventListener('change', onTheme);
      motionQuery.removeEventListener('change', onMotion);
      /* dispose(), NOT destroy() — destroy() does not exist on ShaderMount.
         Under StrictMode this effect runs twice on mount, so calling the
         wrong name would leak a WebGL context plus a rAF loop immediately,
         and browsers cap live contexts at roughly 16. */
      mount.dispose();
      mountRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className="liquid-backdrop" aria-hidden="true" />;
}
