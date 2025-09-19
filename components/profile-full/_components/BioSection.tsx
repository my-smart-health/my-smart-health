import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";

export default function BioSection({ bio }: { bio: string }) {
  if (!bio) return null;
  return (
    <section>
      <article className="text-base">
        <SeeMoreLess text={bio} />
      </article>
    </section>
  );
}