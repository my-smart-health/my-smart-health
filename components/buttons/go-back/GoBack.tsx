'use client'

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GoBack({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white"
      prefetch={false}
    >
      <ArrowLeft /> <span className="pl-2">Zurück</span>
    </Link>
  );
}
