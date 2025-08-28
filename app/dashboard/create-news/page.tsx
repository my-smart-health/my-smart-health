import { auth } from "@/auth";
import CreateNewsForm from "./CreateNewsForm";
import { redirect } from "next/navigation";

export default async function CreateNewsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col gap-4 h-full min-h-[72dvh] max-w-[90%]">
      <h1 className="text-4xl font-bold text-primary text-center">Create News</h1>
      <CreateNewsForm session={session} />
    </main>
  );
}
