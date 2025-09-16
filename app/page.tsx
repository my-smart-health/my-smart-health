import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";

// async function getUsers() {
//   const users = await prisma.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       profileImages: true,
//     },
//   });
//   return { users };
// }
async function getNews() {
  const news = await prisma.posts.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      photos: true,
      createdAt: true,
    }
  });
  return { news };
}

export default async function Home() {

  // const { users } = await getUsers();
  const { news } = await getNews();

  // const safeUsers = users.reduce((acc, user) => {
  //   if (!user.name || !user.profileImages || user.profileImages.length === 0) return acc;
  //   acc.push({
  //     id: user.id,
  //     name: user.name,
  //     profileImage: user.profileImages[0],
  //   });
  //   return acc;
  // }, [] as Array<{ id: string; name: string; profileImage: string }>);

  const newsTopCarousel = news.length > 0
    ? news.map(item => ({ id: item.id, name: item.title, profileImage: item.photos[0] }))
    : undefined;

  const safeNews = news.length > 0 ? news.map(item => ({
    id: item.id,
    info: item.title,
    image: item.photos && item.photos.length > 0 ? item.photos[0] : '',
  })) : null;

  return (
    <main className="flex flex-col items-center gap-4 max-w-[100%] min-h-[100dvh] mb-auto justify-items-center">
      <span className="w-full">
        <TopCarousel props={newsTopCarousel} />
        {/* <TopCarousel props={safeUsers} /> */}
      </span>
      {safeNews && <NewsCarousel props={safeNews} />}
      <div className="flex flex-col gap-3 w-full mx-auto max-w-[100%]">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
        <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
        <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
        <TheHealthBarLink />
      </div>
    </main>
  );
}
