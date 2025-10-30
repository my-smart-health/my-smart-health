'use client';

import { FieldOfExpertise } from "@/utils/types";
import { useState, useRef, useEffect } from "react";

type FieldOfExpertiseSectionProps = {
  fieldOfExpertise: FieldOfExpertise[] | null;
};

function TooltipItem({ expertise }: { expertise: FieldOfExpertise }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number | 'auto'; right: number | 'auto' }>({
    top: 0,
    left: 'auto',
    right: 'auto'
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const top = triggerRect.bottom + 8;
      let left: number | 'auto' = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      let right: number | 'auto' = 'auto';

      if (typeof left === 'number' && left + tooltipRect.width > viewportWidth - 16) {
        left = 'auto';
        right = 16;
      }

      if (typeof left === 'number' && left < 16) {
        left = 16;
      }

      setPosition({ top, left, right });
    }
  }, [isVisible]);

  if (!expertise.description) {
    return <span>{expertise.label}</span>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span ref={triggerRef} className="link cursor-help">
        {expertise.label}
      </span>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-primary text-primary-content px-3 py-2 rounded shadow-lg max-w-[min(90vw,400px)] max-h-[60vh] overflow-auto break-words"
          style={{
            top: `${position.top}px`,
            left: position.left !== 'auto' ? `${position.left}px` : undefined,
            right: position.right !== 'auto' ? `${position.right}px` : undefined,
          }}
        >
          <div className="font-black text-sm">{expertise.description}</div>
        </div>
      )}
    </span>
  );
}

export default function FieldOfExpertiseSection({ fieldOfExpertise }: FieldOfExpertiseSectionProps) {
  if (!fieldOfExpertise) return null;
  if (fieldOfExpertise.length === 0) return null;

  return (
    <>
      <section className="flex flex-wrap gap-2 ml-2 my-auto ">
        {fieldOfExpertise.map((expertise) => (
          <span key={expertise.id} className="badge p-3 text-lg font-semibold">
            <TooltipItem expertise={expertise} />
          </span>
        ))}
      </section>
    </>
  );
}