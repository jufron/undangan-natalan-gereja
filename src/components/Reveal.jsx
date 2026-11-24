import { motion, useReducedMotion } from "motion/react";

/**
 * Wrapper animasi reveal saat scroll (hanya sekali per elemen).
 * Menghormati preferensi prefers-reduced-motion pengguna.
 */
export default function Reveal({ children, className = "", delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
