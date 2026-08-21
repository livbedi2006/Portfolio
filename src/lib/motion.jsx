import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion';

/* ============================================================
   Motion primitives — the shared vocabulary for the whole site.
   Every primitive degrades gracefully when the visitor has
   `prefers-reduced-motion: reduce` set.
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1];

/* Reveal — fade + rise as it scrolls into view (once). */
export function Reveal({ children, y = 24, delay = 0, className = '', as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/* Stagger — parent that releases children in sequence. */
export function Stagger({ children, className = '', stagger = 0.09, delay = 0.05, ...rest }) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, y = 20, className = '', as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/* MagneticButton — element drifts toward the cursor, springs back. */
export function Magnetic({ children, strength = 0.35, className = '', ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { x: sx, y: sy }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* SpotlightCard — 3D tilt + pointer-tracked spotlight glow.
   Writes --mx / --my for the .spotlight CSS glow, tilts on rotateX/Y. */
export function SpotlightCard({ children, className = '', tilt = 6, ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 250, damping: 22 });
  const sry = useSpring(ry, { stiffness: 250, damping: 22 });

  function onMove(e) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty('--mx', `${px * 100}%`);
    ref.current.style.setProperty('--my', `${py * 100}%`);
    if (!reduce) {
      ry.set((px - 0.5) * tilt * 2);
      rx.set((0.5 - py) * tilt * 2);
    }
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={`spotlight ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* CountUp — animates a number from 0 → value when scrolled into view. */
export function CountUp({ value, suffix = '', prefix = '', decimals = 0, duration = 1.6, className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{Number(display).toFixed(decimals)}{suffix}
    </span>
  );
}

/* Marquee — infinite horizontal scroll (content duplicated for seamless loop). */
export function Marquee({ children, className = '' }) {
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div className="marquee-track">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

export { EASE };
