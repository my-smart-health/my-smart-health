import Link from "next/link";

export default function GoToButton({ src, name, className = "text-blue-600 hover:underline" }: { src: string; name: string; className?: string }) {
  return (
    <Link href={src} className={className}>
      {name}
    </Link>
  );
}
