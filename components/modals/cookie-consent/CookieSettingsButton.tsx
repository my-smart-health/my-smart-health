"use client";

type CookieSettingsButtonProps = {
  title: string;
};

export default function CookieSettingsButton({ title }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("msh:cookie:open"));
      }}
      className="underline hover:opacity-80"
    >
      {title}
    </button>
  );
}
