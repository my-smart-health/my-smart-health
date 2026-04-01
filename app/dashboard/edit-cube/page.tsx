import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import Image from "next/image";
import { addToCube, removeFromCube, moveUpInCube, moveDownInCube, toggleCube, getCubePosts, getNewsNotInCube, getOrCreateCube } from "./actions";
import { CirclePlus, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function EditCubePage() {
  const session = await auth();
  const t = await getTranslations('EditCubePage');

  if (!session || session.user.role !== 'ADMIN') {
    return redirect('/login');
  }

  const cube = await getOrCreateCube();
  const [cubePosts, candidates] = await Promise.all([
    getCubePosts(cube.id),
    getNewsNotInCube(),
  ]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('previewTitle')}</h2>
        <NewsCarousel props={cubePosts.map((p: (typeof cubePosts)[number]) => ({ id: p.id, info: p.title, image: p.photos && p.photos[0] ? p.photos[0] : '' }))} />
      </div>

      <form action={toggleCube} className="mb-6 border border-primary rounded-xl p-4 flex items-center gap-3">
        <input type="checkbox" name="onOff" defaultChecked={cube.onOff} className="toggle toggle-primary" id="cubeOnOff" />
        <label htmlFor="cubeOnOff" className="font-medium">{t('toggleLabel')}</label>
        <button type="submit" className="btn btn-primary btn-sm">{t('saveButton')}</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-primary rounded-xl p-4">
          <h3 className="font-semibold mb-3">{t('inCubeTitle')}</h3>
          {cubePosts.length === 0 ? (
            <div className="text-sm text-gray-500">{t('noCubePosts')}</div>
          ) : (
            <ul className="space-y-2">
              {cubePosts.map((p: (typeof cubePosts)[number], idx: number) => (
                <li key={p.id}>
                  <form className="flex items-center gap-2 border border-primary rounded p-2">
                    <span className="w-6 text-right mr-2">{idx + 1}</span>
                    <div className="w-16 h-10 overflow-hidden rounded border border-primary bg-white relative">
                      {p.photos && p.photos[0] ? (
                        <Image src={p.photos[0]} alt={p.title} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('noImage')}</div>
                      )}
                    </div>
                    <span className="flex-1 truncate">{p.title}</span>
                    <input type="hidden" name="postId" value={p.id} />
                    <button type="submit" className="btn btn-circle btn-primary" formAction={moveUpInCube} disabled={idx === 0} aria-disabled={idx === 0}>↑</button>
                    <button type="submit" className="btn btn-circle btn-primary" formAction={moveDownInCube} disabled={idx === cubePosts.length - 1} aria-disabled={idx === cubePosts.length - 1}>↓</button>
                    <button type="submit" className="btn btn-circle text-white btn-error" formAction={removeFromCube}><Trash className="m-2" height={20} width={20} /></button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-primary rounded-xl p-4">
          <h3 className="font-semibold mb-3">{t('availableNewsTitle')}</h3>
          {candidates.length === 0 ? (
            <div className="text-sm text-gray-500">{t('noAvailablePosts')}</div>
          ) : (
            <ul className="space-y-2 max-h-[480px] overflow-auto pr-1">
              {candidates.map((p: (typeof candidates)[number]) => (
                <li key={p.id} className="flex items-center gap-2 border border-primary rounded p-2">
                  <div className="w-16 h-10 overflow-hidden rounded border border-primary bg-white relative">
                    {p.photos && p.photos[0] ? (
                      <Image src={p.photos[0]} alt={p.title} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('noImage')}</div>
                    )}
                  </div>
                  <span className="flex-1 truncate">{p.title}</span>
                  <form action={addToCube}>
                    <input type="hidden" name="postId" value={p.id} />
                    <button type="submit" className="btn btn-circle btn-primary"><CirclePlus className="m-2" height={20} width={20} /></button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}