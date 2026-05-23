"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  staggerDelay?: number;
  delay?: number;
};

export default function Animate({
  children,
  className,
  stagger = false,
  y = 30,
  x = 0,
  scale = 1,
  duration = 0.7,
  staggerDelay = 0.07,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : el;

    // Set initial state before first paint — no flash
    gsap.set(targets, { opacity: 0, y, x, scale });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease: "expo.out",
        stagger: stagger ? staggerDelay : 0,
        clearProps: "transform,opacity,willChange",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
