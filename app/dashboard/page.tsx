import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/db";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import ProfileFull from "@/components/profile-full/ProfileFull";

import { Schedule } from "@/utils/types";
import Divider from "@/components/divider/Divider";
import CreateNewAccount from "@/components/buttons/create-new-account/CreateNewAccount";
import { CalendarPlus2 } from "lucide-react";
import Link from "next/link";

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
      fieldOfExpertise: true,
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

  const safeUser = user
    ? { ...user, schedule: Array.isArray(user.schedule) ? user.schedule as Schedule[] : [] }
    : null;

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">

      <h1 className="mx-3 text-4xl font-extrabold  text-primary mb-6">Welcome, {user?.name || "User"}!</h1>

      <div className="flex gap-4 mb-8 border border-primary p-4 rounded-lg shadow-lg">
        <CreateNewAccount session={session} />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-outline btn-warning hover:text-white shadow" />
        <GoToButton src="/dashboard/create-post" name="New Post" className="btn btn-outline btn-success hover:text-white shadow" />
      </div>

      {safeUser && <ProfileFull user={safeUser} />}

      <Divider />

      <section className="flex flex-col w-full rounded-2xl shadow-md">
        <div className="font-semibold text-primary text-2xl text-center">Recipe</div>

        <Divider addClass="my-4" />

        <div className="flex align-middle w-full mb-8">
          <Link
            href="https://moers.cms.shic.us/Arzttemin_reservieren"
            target="_blank"
            className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
          >
            <CalendarPlus2 /> <span>online Termine - Reservierung</span>
          </Link>
        </div>
      </section>

    </main >
  );
}
