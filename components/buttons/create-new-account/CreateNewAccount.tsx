import Link from "next/link";
import { Session } from "next-auth";

export default function CreateNewAccount({ session }: { session: Session | null }) {

  return (
    <>
      {
        session && session.user.role === 'ADMIN' && (
          <Link href="/register" className="btn btn-outline btn-error hover:text-white">Create new account</Link>
        )
      }
    </>
  );
}