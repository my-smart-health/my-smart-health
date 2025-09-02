import { auth } from "@/auth";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AtSign, Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { parseSocials } from "@/utils/common";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      profileImages: true,
      address: true,
      bio: true,
      displayEmail: true,
      phone: true,
      website: true,
      socials: true,
      schedule: true,
    }
  });
  return { user };
}

async function getPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return { posts };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const { user } = await getData(session.user.id);
  const { name, profileImages, address, bio, phone, socials, website } = user || {};
  const { posts } = await getPosts(session.user.id);

  const parsedSocials = parseSocials(socials || []);

  const platformIcons: Record<string, React.ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={20} />,
    Website: <Globe className="inline-block mr-1" size={20} />,
    Facebook: <Facebook className="inline-block mr-1" size={20} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={20} />,
    X: <Image src={Xlogo} width={20} height={20} alt="X.com" className="w-6 mr-1" />,
    Youtube: <Youtube className="inline-block mr-1" size={20} />,
    TikTok: <Image src={TikTokLogo} width={20} height={20} alt="TikTok" className="w-10 mr-1" />,
    Instagram: <Instagram className="inline-block mr-1" size={20} />,
  };

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[100%] text-wrap break-normal">

      <h1 className="mx-3 text-4xl font-extrabold  text-primary mb-6">Welcome, {name || "User"}!</h1>

      <div className="flex gap-4 mb-8">
        <GoToButton src="/dashboard/create-news" name="Create News" className="btn btn-primary shadow" />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-primary shadow" />
      </div>

      <section className="w-full max-w-[90%] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        <div className="flex flex-col items-center ">
          {profileImages && <FadeCarousel photos={profileImages} />}
          <h2 className="mt-4 text-2xl font-bold text-primary">{name || "No name available"}</h2>
          <p className="text-gray-500 text-center break-words">{bio || "No bio available"}</p>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Address:</span>
            <span className="break-words">{address || <span className="text-gray-400">No address available</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="break-words">{phone || <span className="text-gray-400">No phone number available</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Website:</span>
            {website ? (
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{website}</a>
            ) : (
              <span className="text-gray-400">No website available</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Socials:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {socials && parsedSocials.length > 0 ? (
                parsedSocials.map((social, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="flex items-center justify-center">
                      {platformIcons[social.platform] || null}
                    </span>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                    >
                      {social.url}
                    </a>

                  </div>
                ))
              ) : (
                <span className="text-gray-400">No social media links available</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl rounded-2xl shadow-md flex flex-col gap-8">
        <div className="font-semibold text-primary text-2xl text-center p-4">My Posts</div>
        <div className="flex flex-col gap-2 mt-1 p-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-secondary/20 rounded-lg p-3 shadow-xl">
                <h3 className="font-semibold text-lg text-primary">{post.title}</h3>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No posts available</span>
          )}
        </div>
      </section>

      <section className="w-full max-w-3xl rounded-2xl shadow-md flex flex-col gap-8">
        <div className="font-semibold text-primary text-2xl text-center p-4">My Posts</div>
        <div className="flex flex-col gap-2 mt-1 p-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-secondary/20 rounded-lg p-3 shadow-xl">
                <h3 className="font-semibold text-lg text-primary">{post.title}</h3>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
                <div className="flex flex-row-reverse gap-2 mt-4 mb-2">
                  <GoToButton src={`/news/${post.id}`} name="View Post" className="btn btn-primary shadow" />
                  <GoToButton src={`/dashboard/edit-post/${post.id}`} name="Edit Post" className="btn btn-dash shadow" />
                </div>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No posts available</span>
          )}
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
