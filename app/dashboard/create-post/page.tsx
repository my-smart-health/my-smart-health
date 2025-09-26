import { auth } from "@/auth";
import CreatePostForm from "../../../components/posts/create-post-form/CreatePostForm";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-primary text-center">New Post</h1>
      <CreatePostForm session={session} />
    </>
  );
}
