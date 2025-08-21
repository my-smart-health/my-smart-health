'use client'

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center m-auto">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">We're sorry, but the page you are looking for does not exist.</p>
      <Link className="mt-4 px-4 py-2 bg-primary text-white rounded" href="/">Go back</Link>
    </div>
  );
}
