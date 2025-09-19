export default function FieldOfExpertiseSection({ fieldOfExpertise }: { fieldOfExpertise: string[] }) {
  if (!fieldOfExpertise?.length) return null;
  return (
    <>
      <section>
        <p className="font-semibold">
          {fieldOfExpertise.join(", ")}
        </p>
      </section>
    </>
  );
}