"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* Shared easing — matches the CSS cubic-bezier(0.22, 1, 0.36, 1) used in globals.css */
const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Distance in px the element travels up while fading in. */
  distance?: number;
  className?: string;
};

/**
 * Fade + slide a block into view the first time it scrolls into the viewport.
 * Honours the user's reduced-motion preference by rendering statically.
 */
export function Reveal({ children, delay = 0, distance = 24, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the first child animates. */
  delay?: number;
  as?: "div" | "ul" | "section";
};

/** Parent that staggers its `<StaggerItem>` children as they scroll into view. */
export function Stagger({ children, className, delay = 0, as = "div" }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Child of `<Stagger>` — inherits the parent's reveal state. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}

/**
 * Standard entrance for a whole page/section: subtle rise + fade on mount.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  distance = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
