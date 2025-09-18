import React from "react";
import Divider from "@/components/divider/Divider";

type PhoneNumbersSectionProps = {
  phoneNumbers: string[];
  setPhoneNumbers: (numbers: string[]) => void;
  platformIcon?: React.ReactNode;
};

export function PhoneNumbersSection({ phoneNumbers, setPhoneNumbers, platformIcon }: PhoneNumbersSectionProps) {
  return (
    <section className="space-y-4">
      {!phoneNumbers.length && (
        <span className="font-semibold text-gray-700">
          {platformIcon} Phone Numbers
        </span>
      )}
      {phoneNumbers.map((phone, idx) => (
        <div className="flex flex-row flex-1 gap-2 items-center" key={idx}>
          <div className="flex flex-col flex-1 gap-2">
            <span className="font-semibold text-gray-700">
              {platformIcon} Phone Number
            </span>
            <label htmlFor={`phone[${idx}]`} className="flex flex-row gap-2">
              <input
                type="text"
                name={`phone[${idx}]`}
                value={phone}
                onChange={e => {
                  const updated = [...phoneNumbers];
                  updated[idx] = e.target.value;
                  setPhoneNumbers(updated);
                }}
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                const updated = [...phoneNumbers];
                updated.splice(idx, 1);
                setPhoneNumbers(updated);
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
        onClick={() => setPhoneNumbers([...phoneNumbers, ""])}
        className="btn btn-outline btn-primary px-3 py-1 w-full"
      >
        Add Phone Number
      </button>
    </section>
  );
}