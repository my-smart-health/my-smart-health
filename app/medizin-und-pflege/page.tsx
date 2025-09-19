
import prisma from "@/lib/db";
import { PROFILE_TYPE_MEDIZIN_UND_PFLEGE } from "@/utils/constants";
import { Triangle } from "lucide-react";
import Link from "next/link";

async function getCategories() {
  const user = await prisma.user.findMany({
    where: { profileType: PROFILE_TYPE_MEDIZIN_UND_PFLEGE },
    select: {
      id: true,
      category: true
    }
  });
  return { user };
}

export default async function MedizinUndPflegePage() {

  const { user } = await getCategories();

  const uniqueCategories = Array.from(new Set(user.flatMap(u => u.category))).filter(u => u.length > 0).sort();

  return (
    <main className="w-full mb-auto max-w-full">
      {user && user.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {uniqueCategories.map((category, index) => {

            const categoryLink = category.replace(/\s+/g, '-').replace(/%26/g, '&');
            return (
              <Link
                key={index}
                className="flex items-center gap-2 p-4 indent-1 font-bold text-xl border border-gray-400 rounded-2xl shadow-xl transition-shadow cursor-pointer"
                href={`/medizin-und-pflege/${categoryLink}`}
              >
                <Triangle className="rotate-90 text-primary stroke-3 fill-primary" /><p>{category}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center p-4">No profiles found.</p>
      )}
    </main>
  );
}
