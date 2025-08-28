import { auth } from "@/auth";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const email = session.user.email as string;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!session || !user) {
    redirect("/login");
  }

  return (
    <>
      <main className="flex flex-col gap-4 h-full min-h-[72dvh] max-w-[90%]">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <GoToButton src="/dashboard/create-news" name="Create News" />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" />
        <table className="flex flex-col items-start text-wrap max-w-[90%]">
          <thead>
            <tr>
              <th className="p-2 border-b">Property</th>
              <th className="p-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody className="flex flex-col h-fit w-full max-w-[90%] text-wrap">
            {session && session.user && Object.entries(session.user).map(([key, value]) => (
              <tr key={key}>
                <td className="p-2 border-b">{key}</td>
                <td className="p-2 border-b">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="flex flex-col items-start text-wrap max-w-[90%] mt-8">
          <thead>
            <tr>
              <th className="p-2 border-b">User Property</th>
              <th className="p-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody className="flex flex-col h-fit w-full max-w-[90%] text-wrap">
            {user &&
              Object.entries(user).map(([key, value]) => (
                <tr key={key}>
                  <td className="p-2 border-b">{key}</td>
                  <td className="p-2 border-b">{String(value)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {session.user.role === 'ADMIN' && <div>Create new account <Link href="/register" className="btn btn-accent text-white">here</Link></div>}
      </main>
    </>
  );
}
