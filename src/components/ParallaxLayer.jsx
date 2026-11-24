import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Lapisan animasi parallax halus berbasis scroll (hanya properti transform: translateY).
 * Otomatis nonaktif jika pengguna mengaktifkan prefers-reduced-motion.
 */
export default function ParallaxLayer({
  targetRef,
  offset = ["start end", "end start"],
  range = [-24, 24],
  className = "",
  children,
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], range);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
