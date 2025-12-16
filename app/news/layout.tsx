import type { ReactNode } from 'react';
import MySmartHealth from '@/components/my-smart-health/MySmartHealth';
import ProfileSearchToggle from '@/components/search/ProfileSearchToggle';
import CategoryButton from '@/components/buttons/category-button/CategoryButton';
import TheHealthBarLink from '@/components/buttons/the-health-bar-link/TheHealthBarLink';
import { CirclePlus } from 'lucide-react';
import { CATEGORY_NAMES } from '@/utils/constants';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <MySmartHealth />
      <ProfileSearchToggle />
      <div className="space-y-4 mx-auto w-full">
        <CategoryButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={'/'} active />
      </div>
      {children}
      <CategoryButton name={CATEGORY_NAMES.theLeadingDoctors.name} goTo={CATEGORY_NAMES.theLeadingDoctors.link} imageAsTitle="/the-leading-doctors.png" />
      <CategoryButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <CategoryButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
      <CategoryButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
      <TheHealthBarLink />
    </div>
  );
}
