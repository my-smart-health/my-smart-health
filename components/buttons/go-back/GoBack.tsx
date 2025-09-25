'use client'

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GoBack() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white"
      type="button"
    >
      <ArrowLeft /> <span className="pl-2">Zurück</span>
    </button>
  );
}
