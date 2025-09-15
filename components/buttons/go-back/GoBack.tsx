'use client'

import { ArrowLeft } from "lucide-react";

export default function GoBack() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white"
      onClick={handleGoBack}
    >
      <ArrowLeft /> <span className="pl-2">Zurück</span>
    </button>
  );
}
