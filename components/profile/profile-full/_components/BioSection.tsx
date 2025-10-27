import Divider from "@/components/divider/Divider";
import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";

export default function BioSection({ bio }: { bio: string }) {
  if (!bio) return null;

  return (
    <>
      <Divider addClass="my-4" />
      <section>
        <article className="text-base">
          <SeeMoreLess>
            <div
              className="prose prose-sm max-w-none bio-content"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </SeeMoreLess>
        </article>
      </section>
    </>
  );
}