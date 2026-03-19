import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CACHE_STRATEGY } from "@/utils/constants";

async function getMyContacts(userId: string) {
  const contacts = await prisma.memberDoctor.findMany({
    where: {
      doctorId: userId,
    },
    include: {
      member: {
        select: {
          id: true,
          name: true,
          email: true,
          birthday: true,
          createdAt: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      member: {
        name: "asc",
      },
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  return contacts.map((contact: (typeof contacts)[number]) => ({
    id: contact.member.id,
    name: contact.member.name,
    email: contact.member.email,
    birthday: contact.member.birthday?.toISOString() || null,
    createdAt: contact.member.createdAt.toISOString(),
    isActive: contact.member.isActive,
  }));
}

export default async function MyContactsPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session.user.role !== "USER") {
    return redirect("/dashboard");
  }

  const contacts = await getMyContacts(session.user.id);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-primary">My Contacts</h1>
        <p className="text-gray-600">
          Members who have added you to their contacts list
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-base-200 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-gray-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Contacts Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            You don&apos;t have any member contacts yet. Members can add you to their
            contacts list to share their health information with you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact: (typeof contacts)[number]) => (
            <Link
              key={contact.id}
              href={`/profile-member/${contact.id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-300 hover:border-primary"
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="card-title text-lg truncate">
                      {contact.name || "Unnamed Member"}
                    </h2>
                    {!contact.isActive && (
                      <span className="badge badge-error badge-sm">Inactive</span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                {contact.birthday && (
                  <p className="text-xs text-gray-400">
                    Born: {new Date(contact.birthday).toLocaleDateString()}
                  </p>
                )}
                <div className="card-actions justify-end mt-2">
                  <span className="text-xs text-primary font-semibold">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="stats shadow bg-accent/20">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <div className="stat-title">Total Contacts</div>
          <div className="stat-value text-primary">{contacts.length}</div>

        </div>
      </div>
    </div>
  );
}
