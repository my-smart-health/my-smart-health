import { RefObject } from "react";

type BioSectionProps = {
  bio: string;
  setBio: (val: string) => void;
  bioRef?: RefObject<HTMLTextAreaElement | null>;
};

export function BioSection({ bio, setBio, bioRef }: BioSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Bio</span>
        <textarea
          name="bio"
          ref={bioRef}
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
          rows={1}
        />
      </label>
    </section>
  );
}