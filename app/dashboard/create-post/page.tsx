import { auth } from "@/auth";
import CreatePostForm from "../../../components/posts/create-post-form/CreatePostForm";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col gap-4 h-full min-h-[72dvh] max-w-[90%]">
      <h1 className="text-4xl font-bold text-primary text-center">New Post</h1>
      <CreatePostForm session={session} />
    </main>
  );
}
