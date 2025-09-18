import React from "react";

type WebsiteSectionProps = {
  website: string;
  setWebsite: (val: string) => void;
  icon?: React.ReactNode;
};

export function WebsiteSection({ website, setWebsite, icon }: WebsiteSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">
          {icon}Website
        </span>
        <input
          type="url"
          name="website"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </label>
    </section>
  );
}