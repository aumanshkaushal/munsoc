"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const shouldReduce = mounted && Boolean(reduceMotion);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: shouldReduce ? 0.01 : duration,
        delay: shouldReduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const shouldReduce = mounted && Boolean(reduceMotion);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className={className}
      variants={
        shouldReduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : itemVariants
      }
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const shouldReduce = mounted && Boolean(reduceMotion);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1600, bounce: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    if (shouldReduce) {
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }
    });
  }, [spring, suffix, shouldReduce, value]);

  return <span ref={ref} className={className}>{`0${suffix}`}</span>;
}

export function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const shouldReduce = mounted && Boolean(reduceMotion);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className={className}
      whileHover={shouldReduce ? undefined : { y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
