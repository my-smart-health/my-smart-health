'use client';
import { useEffect, useRef, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateVisibility = () => {
      const threshold = window.innerHeight;
      setVisible(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        updateVisibility();
        rafId.current = null;
      });
    };

    const onResize = () => updateVisibility();

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={[
        'btn btn-circle fixed bottom-25 right-6 p-2 bg-primary text-white rounded-full shadow-lg',
        'hover:bg-primary/75 focus:outline-none focus:ring-2 focus:ring-primary/50',
        'transition-all duration-300 ease-out z-50',
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none',
      ].join(' ')}
    >
      ↑
    </button>
  );
}