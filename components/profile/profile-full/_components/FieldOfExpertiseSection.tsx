import Divider from "@/components/divider/Divider";

export default function FieldOfExpertiseSection({ fieldOfExpertise }: { fieldOfExpertise: string[] }) {
  if (!fieldOfExpertise?.length) return null;
  return (
    <>
      <Divider addClass="my-2" />
      <section>
        <p className="font-semibold">
          {fieldOfExpertise.join(", ")}
        </p>
      </section>
    </>
  );
}