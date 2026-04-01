'use client';

import Divider from "@/components/divider/Divider";
import { MAX_FILES_PER_USER } from "@/utils/constants";
import React from "react";
import { useTranslations } from 'next-intl';

type MediaUrlSectionProps = {
  blobResult: string[];
  setError: (msg: string | null) => void;
  setBlobResult: (urls: string[]) => void;
  handleAddURL: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function MediaUrlSection({
  blobResult,
  handleAddURL,
}: MediaUrlSectionProps) {
  const t = useTranslations('EditProfileForm');
  return (
    <section>
      <fieldset className={blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}>
        <legend className="fieldset-legend">{t('mediaUrl.legend')}</legend>
        <div className="flex flex-col gap-4 w-full">
          <label htmlFor="media" className="">
            {t('mediaUrl.instruction')}
          </label>
          <input
            type="text"
            name="media"
            placeholder={t('mediaUrl.placeholder')}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />

          <button
            type="button"
            onClick={handleAddURL}
            className="btn btn-outline btn-primary w-full mt-2"
          >
            {t('mediaUrl.button')}
          </button>

          <Divider addClass="my-1" />

          <div className="flex flex-wrap max-w-[50%] gap-4 text-wrap mx-auto">
            {blobResult && blobResult.length > 0 && (
              <>
                <div className="text-sm">
                  {t('mediaUrl.countInfo', { max: MAX_FILES_PER_USER })}
                </div>
                <p className="text-wrap text-warning">
                  {t('mediaUrl.firstMediaWarning')}
                </p>
              </>
            )}
          </div>
        </div>
      </fieldset>
    </section>
  );
}