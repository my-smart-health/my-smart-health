"use client";

import { ForwardedRef } from "react";

export interface CookieActionButton {
  label: string;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  ref?: ForwardedRef<HTMLButtonElement>;
}

interface CookieActionButtonsProps {
  buttons: CookieActionButton[];
  containerClassName?: string;
}

export default function CookieActionButtons({
  buttons,
  containerClassName = "flex flex-wrap gap-2"
}: CookieActionButtonsProps) {
  return (
    <div className={containerClassName}>
      {buttons.map((button, index) => (
        <button
          key={index}
          ref={button.ref}
          onClick={button.onClick}
          className={button.className || "btn btn-outline flex-1 min-w-[100px]"}
          aria-label={button.ariaLabel}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
