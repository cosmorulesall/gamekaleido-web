'use client';

import { useEffect, useRef } from 'react';

export function KaleidoPlaceholder() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        container.style.transform = `translateY(${scrollY * 0.15}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-[kaleidoDrift1_20s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, var(--mk-amethyst), transparent 70%)',
          top: '-10%',
          left: '10%',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-[kaleidoDrift2_25s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, var(--mk-sapphire), transparent 70%)',
          top: '20%',
          right: '5%',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] animate-[kaleidoDrift3_18s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, var(--mk-ruby), transparent 70%)',
          bottom: '10%',
          left: '30%',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-10 blur-[90px] animate-[kaleidoDrift1_22s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(circle, var(--mk-emerald), transparent 70%)',
          top: '40%',
          left: '60%',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[70px] animate-[kaleidoDrift2_16s_ease-in-out_infinite_reverse]"
        style={{
          background: 'radial-gradient(circle, var(--mk-amber), transparent 70%)',
          bottom: '20%',
          right: '20%',
        }}
      />
    </div>
  );
}
