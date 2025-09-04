import Link from "next/link";
import { Session } from "next-auth";

export default function CreateNewAccount({ session }: { session: Session | null }) {

  return (
    <>
      {
        session && session.user.role === 'ADMIN' && (
          <div className="mt-8">
            <span className="mr-2">Create new account</span>
            <Link href="/register" className="btn btn-accent text-white">here</Link>
          </div>
        )
      }
    </>
  );
}