"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("msh:cookie:open"));
      }}
      className="underline hover:opacity-80"
    >
      Cookie Einstellungen
    </button>
  );
}
