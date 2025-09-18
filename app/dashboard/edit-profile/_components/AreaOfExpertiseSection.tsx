import Divider from "@/components/divider/Divider";
import React from "react";

type AreaOfExpertiseSectionProps = {
  fieldOfExpertise: string[];
  setFieldOfExpertise: (fields: string[]) => void;
  icon?: React.ReactNode;
};

export function AreaOfExpertiseSection({
  fieldOfExpertise,
  setFieldOfExpertise,
  icon,
}: AreaOfExpertiseSectionProps) {
  return (
    <section>
      {!fieldOfExpertise.length && (
        <span className="font-semibold text-gray-700">Area of Expertise</span>
      )}
      {fieldOfExpertise.map((expertise, idx) => (
        <div className="flex flex-row flex-1 gap-2 items-center" key={idx}>
          <div className="flex flex-col flex-1">
            <span className="font-semibold text-gray-700">
              {icon} Area of Expertise
            </span>
            <label htmlFor={`expertise[${idx}]`} className="flex flex-row gap-2">
              <input
                type="text"
                name={`expertise[${idx}]`}
                value={expertise}
                onChange={e => {
                  const updated = [...fieldOfExpertise];
                  updated[idx] = e.target.value;
                  setFieldOfExpertise(updated);
                }}
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                const updated = [...fieldOfExpertise];
                updated.splice(idx, 1);
                setFieldOfExpertise(updated);
              }}
              className="btn btn-outline flex place-self-end mt-4 w-fit align-bottom text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <Divider addClass="my-4" />

      <button
        type="button"
        onClick={() => setFieldOfExpertise([...fieldOfExpertise, ""])}
        className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
      >
        + Area of Expertise
      </button>
    </section>
  );
}