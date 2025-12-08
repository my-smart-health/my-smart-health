'use client';

import { useEffect, useRef, useState } from "react";
import { FieldOfExpertise } from "@/utils/types";

type FieldOfExpertiseSectionProps = {
  fieldOfExpertise: FieldOfExpertise[] | null;
};

type TooltipItemProps = {
  expertise: FieldOfExpertise;
};

function TooltipItem({ expertise }: TooltipItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const hasDescription = Boolean(expertise.description?.trim());

  useEffect(() => {
    if (!isVisible) return;

    const hide = () => setIsVisible(false);

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current || !popoverRef.current) return;
      if (triggerRef.current.contains(target) || popoverRef.current.contains(target)) return;
      setIsVisible(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setIsVisible(false);
      triggerRef.current?.focus();
    };

    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible]);

  if (!hasDescription) {
    return (
      <div className="inline-flex w-full justify-center sm:w-auto sm:justify-start">
        <span className="block w-full text-center underline underline-offset-4 sm:w-auto sm:text-left text-base font-semibold text-black">
          {expertise.label}
        </span>
      </div>
    );
  }

  const popoverId = `expertise-${expertise.id}`;

  return (
    <div className="relative inline-flex w-full justify-center sm:w-auto sm:justify-start">
      <button
        type="button"
        ref={triggerRef}
        className="btn btn-link px-0 min-h-0 h-auto w-full justify-center sm:w-auto sm:justify-start text-base font-semibold normal-case text-black underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-haspopup="dialog"
        aria-expanded={isVisible}
        aria-controls={popoverId}
        onClick={() => setIsVisible((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsVisible((prev) => !prev);
          }
        }}
      >
        {expertise.label}
      </button>
      {isVisible && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-modal="false"
          className="absolute z-50 bg-primary text-primary-content px-3 py-2 rounded shadow-lg w-2xs max-w-[min(90vw,400px)] max-h-[60vh] overflow-auto break-words left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-8"
        >
          <div className="font-black text-sm leading-relaxed whitespace-pre-wrap">
            {expertise.description}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FieldOfExpertiseSection({ fieldOfExpertise }: FieldOfExpertiseSectionProps) {
  if (!fieldOfExpertise?.length) return null;

  return (
    <section className="flex flex-col items-center gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
      {fieldOfExpertise.map((expertise) => (
        <TooltipItem key={expertise.id} expertise={expertise} />
      ))}
    </section>
  );
}
