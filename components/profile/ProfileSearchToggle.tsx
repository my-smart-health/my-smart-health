'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

import ProfileSearch from '@/components/profile/ProfileSearch';

type ProfileSearchToggleProps = {
  label?: string;
  className?: string;
};

export default function ProfileSearchToggle({
  label = 'Suche',
  className,
}: ProfileSearchToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`w-full ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex flex-row h-15 w-full rounded-2xl border shadow-xl transition-colors hover:bg-secondary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="w-14 rounded-tl-2xl rounded-bl-2xl flex items-center justify-center bg-primary text-white">
          <SearchIcon size={24} />
        </div>
        <div className="flex items-center justify-start pl-2.5 font-bold text-xl text-[#2c2e35] w-full">
          {label}
        </div>
      </button>

      {open && (
        <div className="mt-4">
          <ProfileSearch />
        </div>
      )}
    </div>
  );
}
