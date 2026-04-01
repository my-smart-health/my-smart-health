import type { ReactNode } from 'react';
import MySmartHealth from '@/components/my-smart-health/MySmartHealth';
import ProfileSearchToggle from '@/components/search/ProfileSearchToggle';
import CategoryButton from '@/components/buttons/category-button/CategoryButton';
import TheHealthBarLink from '@/components/buttons/the-health-bar-link/TheHealthBarLink';
import { CirclePlus } from 'lucide-react';
import { CATEGORY_LINKS } from '@/utils/constants';
import { getTranslations } from 'next-intl/server';

export default async function NewsLayout({ children }: { children: ReactNode }) {
  const tCategories = await getTranslations('Categories');

  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <MySmartHealth />
      <ProfileSearchToggle label={tCategories('search')} />
      <div className="space-y-4 mx-auto w-full">
        <CategoryButton name={tCategories('news')} icon={CATEGORY_LINKS.news.image} goTo="/" active />
      </div>
      {children}
      <CategoryButton name={tCategories('theLeadingDoctors')} goTo={CATEGORY_LINKS.theLeadingDoctors.link} imageAsTitle={CATEGORY_LINKS.theLeadingDoctors.image} />
      <CategoryButton name={tCategories('smartHealth')} icon={CATEGORY_LINKS.smartHealth.image} goTo={CATEGORY_LINKS.smartHealth.link} />
      <CategoryButton name={tCategories('medizinUndPflege')} icon={CATEGORY_LINKS.medizinUndPflege.image} goTo={CATEGORY_LINKS.medizinUndPflege.link} />
      <CategoryButton name={tCategories('notfalle')} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_LINKS.notfalle.link} />
      <TheHealthBarLink />
    </div>
  );
}
