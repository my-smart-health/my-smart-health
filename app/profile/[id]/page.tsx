import { auth } from "@/auth";
import GoBack from "@/components/buttons/go-back/GoBack";
import Divider from "@/components/divider/Divider";
import ProfileFull from "@/components/profile-full/ProfileFull";
import prisma from "@/lib/db";
import { Schedule } from "@/utils/types";
import { CalendarPlus2 } from "lucide-react";
import Link from "next/link";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImages: true,
      address: true,
      bio: true,
      phone: true,
      socials: true,
      website: true,
      fieldOfExpertise: true,
      displayEmail: true,
      schedule: true,
    },
  });
  return { user };
}

function UserNotFound() {
  return (
    <>
      <main
        className="flex flex-col items-center justify-center gap-3 w-full mb-auto max-w-[100%]">
        <div>User not found</div>
        <GoBack />
      </main>
    </>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  const { id } = await params;
  const { user } = await getUser(id);
  if (!user || user === null) {
    return (
      <UserNotFound />
    );
  }
  const safeSchedule = user.schedule ? user.schedule as Schedule[] : [];
  const safeUser = { ...user, schedule: safeSchedule };

  return (
    <>
      <main
        className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 w-full max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
        {(session?.user?.role === "ADMIN" || session?.user?.id === user.id) && (
          <Link
            href={`/dashboard/edit-profile/${user.id}`}
            className="btn btn-wide btn-warning self-center rounded-xl underline">
            Edit profile
          </Link>
        )}
        <ProfileFull user={safeUser} />

        <Divider addClass="my-4" />

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

      </main>
    </>
  );
}