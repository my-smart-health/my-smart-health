import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GoBack() {
  return (
    <Link href="/" className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white">
      <ArrowLeft /> <span className="pl-2">Zurück</span>
    </Link>
  );
}
