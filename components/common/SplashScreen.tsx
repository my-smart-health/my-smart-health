'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (hasShownSplash) {
      setIsVisible(false);
      return;
    }

    const hideTimer = setTimeout(() => {
      setIsAnimatingOut(true);
      sessionStorage.setItem('splashShown', 'true');
    }, 3000);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3800);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-all duration-800 ${isAnimatingOut
        ? 'opacity-0 scale-95'
        : 'opacity-100 scale-100'
        }`}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      <div
        className={`transition-all duration-800 ${isAnimatingOut
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
          className="w-96 h-auto animate-pulse"
          style={{
            animation: isAnimatingOut ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
