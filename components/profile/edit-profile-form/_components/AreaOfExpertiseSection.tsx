import React from "react";
import { FieldOfExpertise } from "@/utils/types";

import Divider from "@/components/divider/Divider";

type AreaOfExpertiseSectionProps = {
  fieldOfExpertise: FieldOfExpertise[];
  setFieldOfExpertise: (fields: FieldOfExpertise[]) => void;
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
        <span className="font-semibold text-gray-700">Expertise</span>
      )}
      {fieldOfExpertise.map((expertise, idx) => (
        <div className="flex flex-row flex-1 gap-2 items-center" key={expertise.id || idx}>
          <div className="flex flex-col flex-1">
            <span className="font-semibold text-gray-700">
              {icon} Expertise {idx + 1}
            </span>
            <label htmlFor={`expertise[${idx}]`} className="flex flex-row gap-2">
              <input
                type="text"
                name={`expertise[${idx}]`}
                value={expertise.label}
                onChange={e => {
                  const updated = [...fieldOfExpertise];
                  updated[idx] = { ...updated[idx], label: e.target.value };
                  setFieldOfExpertise(updated);
                }}
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </label>
            <label htmlFor={`expertise-desc-${idx}`} className="flex flex-row gap-2 mt-2">
              <input
                id={`expertise-desc-${idx}`}
                type="text"
                name={`expertise-desc-${idx}`}
                value={expertise.description || ''}
                onChange={e => {
                  const updated = [...fieldOfExpertise];
                  updated[idx] = { ...updated[idx], description: e.target.value };
                  setFieldOfExpertise(updated);
                }}
                placeholder="Description (optional)"
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

      <Divider addClass="my-1" />

      <button
        type="button"
        onClick={() => {
          const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : String(Date.now());
          setFieldOfExpertise([...fieldOfExpertise, { id, label: '', description: '' }]);
        }}
        className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
      >
        + Expertise
      </button>
    </section>
  );
}