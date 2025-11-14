'use client';

export default function MSHGeneralTitle({ generalTitle, setGeneralTitleAction }: { generalTitle: string; setGeneralTitleAction: (title: string) => void }) {

  return (
    <label>
      General Title:
      <textarea
        name="generalTitle"
        value={generalTitle}
        onChange={(e) => setGeneralTitleAction(e.target.value)}
        className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
      />
    </label>
  );
}