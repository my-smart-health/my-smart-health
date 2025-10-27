'use client';

import RichTextEditor from "@/components/forms/rich-text-editor/RichTextEditor";

type BioSectionProps = {
  bio: string;
  setBio: (val: string) => void;
};

export function BioSection({ bio, setBio }: BioSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Bio</span>
        <RichTextEditor
          value={bio}
          onChange={setBio}
          placeholder="Write your bio with rich formatting..."
        />
      </label>
    </section>
  );
}