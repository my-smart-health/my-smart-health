'use client';

import { useTranslations } from 'next-intl';
import RichTextEditor from "@/components/forms/rich-text-editor/RichTextEditor";

type BioSectionProps = {
  bio: string;
  setBio: (val: string) => void;
};

export function BioSection({ bio, setBio }: BioSectionProps) {
  const t = useTranslations('EditProfileForm');
  return (
    <section>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">{t('bio.label')}</span>
        <RichTextEditor
          value={bio}
          onChange={setBio}
          placeholder={t('bio.placeholder')}
        />
      </div>
    </section>
  );
}