import { auth } from "@/auth";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      image: true,
      address: true,
      bio: true,
      phone: true,
      website: true,
      socials: true,
      posts: true
    }
  });
  return { user };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const { user } = await getData(session.user.id);
  const { name, image, address, bio, phone, socials, website, posts } = user || {};

  return (
    <main className="flex flex-col items-center min-h-[72dvh] py-8 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Welcome, {name || "User"}!</h1>
      <div className="flex gap-4 mb-8">
        <GoToButton src="/dashboard/create-news" name="Create News" className="btn btn-primary shadow" />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-primary shadow" />
      </div>
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:w-1/3">
          {image ? (
            <Image src={image} alt={name || "Profile image"} width={120} height={120} className="rounded-full border-4 border-primary shadow-lg" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-semibold shadow">
              No Image
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold text-primary">{name || "No name available"}</h2>
          <p className="text-gray-500 text-center">{bio || "No bio available"}</p>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Address:</span>
            <span>{address || <span className="text-gray-400">No address available</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span>{phone || <span className="text-gray-400">No phone number available</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Website:</span>
            {website ? (
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a>
            ) : (
              <span className="text-gray-400">No website available</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Socials:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {socials && socials.length > 0 ? (
                socials.map((social, index) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    {social.platform}
                  </a>
                ))
              ) : (
                <span className="text-gray-400">No social media links available</span>
              )}
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Posts:</span>
            <div className="flex flex-col gap-2 mt-1">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                    <h3 className="font-semibold text-lg text-primary">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{post.content}</p>
                    <GoToButton src={`/dashboard/edit-post/${post.id}`} name="Edit Post" className="btn btn-primary shadow" />
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No posts available</span>
              )}
            </div>
          </div>
        </div>
      </section>
      {session && session.user.role === 'ADMIN' && (
        <div className="mt-8">
          <span className="mr-2">Create new account</span>
          <Link href="/register" className="btn btn-accent text-white">here</Link>
        </div>
      )}
    </main>
  );
}
