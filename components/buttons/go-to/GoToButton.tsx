import Link from "next/link";

export default function GoToButton({ src, name }: { src: string; name: string }) {
  return (
    <Link href={src} className="text-blue-600 hover:underline">
      {name}
    </Link>
  );
}
