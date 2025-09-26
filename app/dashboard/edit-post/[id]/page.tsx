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
    return <>
      <h1 className="text-xl font-bold">Post not found</h1>
      <div className="flex flex-row gap-4">
        <GoToButton name="Go to Home" src="/" className="btn btn-primary" />
        <GoToButton name="Go to Dashboard" src="/dashboard" className="btn btn-primary" />
      </div>
    </>;
  }

  if (session.user.role !== 'ADMIN' && session.user.id !== post.authorId) {
    return redirect('/dashboard');
  }

  return <>
    <EditPostForm session={session} post={post} />
  </>;
}