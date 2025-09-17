import Link from "next/link";

import { auth } from "@/auth";
import prisma from "@/lib/db";

import GoBack from "@/components/buttons/go-back/GoBack";
import ProfileFull from "@/components/profile-full/ProfileFull";
import { Certificates, Schedule } from "@/utils/types";

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
      certificates: true,
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
  const safeCertificates = user.certificates ? user.certificates as unknown as Certificates[] : [];

  const safeUser = { ...user, schedule: safeSchedule, certificates: safeCertificates };

  return (
    <>
      <main
        className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 w-full max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
        {(session?.user?.role === "ADMIN") && (
          <Link
            href={`/dashboard/edit-profile/${user.id}`}
            className="btn btn-wide btn-warning self-center rounded-xl underline">
            Edit profile
          </Link>
        )}
        <ProfileFull user={safeUser} />
      </main>
    </>
  );
}