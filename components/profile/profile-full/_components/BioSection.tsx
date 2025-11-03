'use client';

import Divider from "@/components/divider/Divider";
import ParagraphContent from "@/components/common/ParagraphContent";

export default function BioSection({ bio }: { bio: string }) {
  if (!bio) return null;

  return (
    <>
      <Divider addClass="my-4" />
      <section className="w-full overflow-hidden">
        <article className="text-base w-full max-w-full">
          <ParagraphContent content={bio} maxLines={3} className="prose prose-sm" />
        </article>
      </section>
    </>
  );
}