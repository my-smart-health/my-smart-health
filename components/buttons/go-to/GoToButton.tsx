import Link from "next/link";

export default function GoToButton({ src, name, className = "text-blue-600 hover:underline", target = "_self" }: { src: string; name: string; className?: string; target?: string }) {
  return (
    <Link href={src} className={className} target={target}>
      {name}
    </Link>
  );
}
