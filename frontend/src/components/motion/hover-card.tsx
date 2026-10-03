"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Interactive card surface: lifts and scales slightly on hover,
 * presses down on click. Falls back to a plain div under reduced motion.
 */
export function HoverCard({
  children,
  className = "",
  lift = 6,
  scale = 1.015,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift, scale }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps any button/anchor to give it a tactile press effect. */
export function Pressable({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Icon button / chip that springs on hover — used for filter pills,
 * pagination arrows and small controls.
 */
export function IconBounce({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={`inline-flex ${className}`}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.span>
  );
}

/** Shared spring config for dropdowns, drawers and popovers. */
export const POPOVER_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.7,
};

/** Shared easing for non-spring transitions. */
export const EASE_OUT = EASE;
