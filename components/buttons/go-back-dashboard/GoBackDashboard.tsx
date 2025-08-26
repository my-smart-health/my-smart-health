import Link from "next/link";

export default function GoBackDashboard() {
  return (
    <Link href="/dashboard" className="text-blue-600 hover:underline">
      Back to Dashboard
    </Link>
  );
}
