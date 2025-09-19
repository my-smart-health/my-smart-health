import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import EditPostForm from "../../../../components/posts/edit-post-form/EditPostForm";
import GoToButton from "@/components/buttons/go-to/GoToButton";


async function getPostdata(id: string) {
  const post = await prisma.posts.findUnique({
    where: { id },
  });
  return { post };
}

export default async function EditPostIdPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const session = await auth();

  if (!session) {
    return redirect('/login');
  }

  const { post } = await getPostdata(id);

  if (!post) {
    return <main className="flex flex-col items-center gap-8 max-w-[100%] mb-auto justify-items-center">
      <h1 className="text-xl font-bold">Post not found</h1>
      <div className="flex flex-row gap-4">
        <GoToButton name="Go to Home" src="/" className="btn btn-primary" />
        <GoToButton name="Go to Dashboard" src="/dashboard" className="btn btn-primary" />
      </div>
    </main>;
  }

  if (session.user.role !== 'ADMIN' && session.user.id !== post.authorId) {
    return redirect('/dashboard');
  }

  return <main className="flex flex-col items-center gap-8 max-w-[100%] mb-auto justify-items-center">
    <EditPostForm session={session} post={post} />
  </main>;
}