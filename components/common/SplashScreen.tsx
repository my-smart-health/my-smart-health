'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (hasShownSplash) {
      return;
    }

    setIsVisible(true);

    const hideTimer = setTimeout(() => {
      setIsAnimatingOut(true);
      sessionStorage.setItem('splashShown', 'true');
    }, 1000);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1400);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-all duration-500 ${isAnimatingOut
        ? 'opacity-0 scale-95 pointer-events-none'
        : 'opacity-100 scale-100'
        }`}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      <div
        className={`transition-all duration-500 ${isAnimatingOut
          ? 'translate-y-[-45vh] scale-50'
          : 'translate-y-0 scale-100'
          }`}
        style={{
          willChange: 'transform',
        }}
      >
        <Image
          priority
          src="/navbar.jpg"
          alt="My Smart Health"
          width={350}
          height={112}
          className="w-96 h-auto"
          style={{
            animation: isAnimatingOut ? 'none' : 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      </div>

      <div className="absolute bottom-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
