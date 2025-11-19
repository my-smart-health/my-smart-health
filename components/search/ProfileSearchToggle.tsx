'use client';

import { Search as SearchIcon } from 'lucide-react';

import ProfileSearch from '@/components/search/ProfileSearch';

type ProfileSearchToggleProps = {
  label?: string;
  className?: string;
};

export default function ProfileSearchToggle({
  label = 'Suche',
  className,
}: ProfileSearchToggleProps) {
  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <div className="collapse shadow-xl border-2 border-primary rounded-2xl mb-1">
        <input type="checkbox" className="w-full h-full" />
        <div className="collapse-title flex items-center gap-3 w-full h-full font-bold text-xl text-[#2c2e35]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white">
            <SearchIcon size={22} />
          </div>
          {label}
        </div>
        <div className="collapse-content">
          <ProfileSearch />
        </div>
      </div>
    </div>
  );
}
