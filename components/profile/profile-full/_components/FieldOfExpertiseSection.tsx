import Divider from "@/components/divider/Divider";
import { FieldOfExpertise } from "@/utils/types";

type FieldOfExpertiseSectionProps = {
  fieldOfExpertise: FieldOfExpertise[] | null;
};

export default function FieldOfExpertiseSection({ fieldOfExpertise }: FieldOfExpertiseSectionProps) {
  if (!fieldOfExpertise) return null;

  return (
    <>
      <Divider addClass="my-2" />
      <section className="flex flex-wrap gap-2 mx-auto">
        {fieldOfExpertise.length > 0 && fieldOfExpertise.map((expertise) => (
          <div className="tooltip tooltip-primary" data-tip={expertise.description} key={expertise.id}>
            <span className={`${expertise.description ? "link cursor-help" : ""}`}>{expertise.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}