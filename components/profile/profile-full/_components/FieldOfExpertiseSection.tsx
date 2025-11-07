'use client';

import { FieldOfExpertise } from "@/utils/types";
import { useState, useRef, useEffect } from "react";

type FieldOfExpertiseSectionProps = {
  fieldOfExpertise: FieldOfExpertise[] | null;
};

function TooltipItem({ expertise }: { expertise: FieldOfExpertise }) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const hide = () => setIsVisible(false);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide);
      window.removeEventListener('resize', hide);
    };
  }, [isVisible]);

  if (!expertise.description) {
    return <span>{expertise.label}</span>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible((v) => !v)}
      onKeyDown={(e) => { if (e.key === 'Escape') setIsVisible(false); }}
    >
      <span ref={triggerRef} className="link cursor-help">
        {expertise.label}
      </span>
      {isVisible && (
        <div
          className="absolute z-50 bg-primary text-primary-content px-3 py-2 rounded shadow-lg max-w-[min(90vw,400px)] max-h-[60vh] overflow-auto break-words left-1/2 -translate-x-1/2"
          style={{ top: 'calc(100% + 8px)' }}
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
      <section className="flex flex-wrap gap-2 ">
        {fieldOfExpertise.map((expertise) => (
          <span key={expertise.id} className="badge text-lg font-semibold">
            <TooltipItem expertise={expertise} />
          </span>
        ))}
      </section>
    </>
  );
}