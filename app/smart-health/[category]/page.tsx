import GoBack from "@/components/buttons/go-back/GoBack";
import ProfileShort from "@/components/profile/profile-short/ProfileShort";
import prisma from "@/lib/db";
import { PROFILE_TYPE_SMART_HEALTH } from "@/utils/constants";
import { Triangle } from "lucide-react";
import Link from "next/link";

async function getCategories() {
  const categories = await prisma.user.findMany({
    where: { profileType: PROFILE_TYPE_SMART_HEALTH },
    select: {
      id: true,
      category: true
    }
  });
  return { categories };
}

async function getUser(category: string) {
  const user = await prisma.user.findMany({
    where: { profileType: PROFILE_TYPE_SMART_HEALTH, category: { has: category } },
    select: {
      id: true,
      name: true,
      profileImages: true,
      bio: true
    }
  });
  return { user };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const FormattedCategory = category.replace(/-/g, ' ').replace(/%26/g, '&');

  const { user } = await getUser(FormattedCategory);

  const { categories } = await getCategories();

  const uniqueCategoryList = Array.from(new Set(categories.flatMap(u => u.category))).filter(u => u.length > 0).sort();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 ">
        {uniqueCategoryList.map(async (cat, index) => {

          const formattedCategory = cat.replace(/\s+/g, '-').replace(/%26/g, '&');
          const safeCategoryParam = category.replace(/\s+/g, '-').replace(/%26/g, '&');

          if (formattedCategory === safeCategoryParam) {
            return (
              <>
                <Link
                  key={index}
                  className="flex items-center gap-2 p-4 indent-1 font-bold text-xl border border-gray-400 rounded-2xl shadow-xl transition-shadow cursor-pointer"
                  href={`/smart-health/${formattedCategory}`}
                >
                  <Triangle className='rotate-180 text-primary stroke-3 fill-primary' /><p>{cat}</p>
                </Link>

                {user && user.length > 0 ? (
                  user.map((user) => {
                    const { id, name, profileImages, bio } = user;

                    if (!id || !name || !profileImages || !bio) {
                      console.warn('Incomplete user data:', user);
                      return null;
                    }

                    return (
                      <ProfileShort
                        key={id}
                        id={id}
                        name={name}
                        bio={bio}
                        image={profileImages[0]}
                      />
                    );

                  }))
                  : (
                    <p className="text-gray-600">No users found.</p>
                  )}
                <div className="flex flex-col items-end w-full">
                  <GoBack />
                </div>
              </>
            );
          } else {
            return (
              <>
                <Link
                  key={index}
                  className="flex items-center gap-2 p-4 indent-1 font-bold text-xl border border-gray-400 rounded-2xl shadow-xl transition-shadow cursor-pointer"
                  href={`/smart-health/${formattedCategory}`}
                >
                  <Triangle className='rotate-90 text-primary stroke-3 fill-primary' /><p>{cat}</p>
                </Link>
              </>
            );
          }
        })}
      </div >
    </>
  );
}