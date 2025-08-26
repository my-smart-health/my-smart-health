'use client'
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();
  const redirectToPreviousPage = () => {
    router.back();
    router.refresh();
  };

  return (
    <Link href="/" className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white" onClick={redirectToPreviousPage}>
      <ArrowLeft /> <span className="pl-2">Zurück</span>
    </Link>
  );
}
