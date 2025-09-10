import GoBack from "@/components/buttons/go-back/GoBack";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import prisma from "@/lib/db";
import { NewsCardType } from "@/utils/types";
import NewsCardDetails from "./NewsCardDetails";
import { auth } from "@/auth";


async function getData(id: string): Promise<NewsCardType | null> {
  const prismaResult = await prisma.posts.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      photos: true,
      tags: true,
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true,
        }
      }
    }
  })
  return prismaResult as NewsCardType | null;
}

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  const { id } = await params;
  const newsData = await getData(id);

  return (
    <main className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <div className="space-y-4 mx-auto w-full">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" active />
        <div className="flex justify-end my-2">
          <GoBack />
        </div>
      </div>
      {session
        ? <NewsCardDetails newsData={newsData} session={session} />
        : <NewsCardDetails newsData={newsData} />
      }
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
    </main>
  );
}
