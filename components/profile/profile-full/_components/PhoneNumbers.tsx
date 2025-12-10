import React from "react";
import Link from "next/link";

type PhoneNumbersProps = {
  phoneNumbers: string[];
  platformIcons: Record<string, React.ReactNode>;
};

export default function PhoneNumbers({ phoneNumbers, platformIcons }: PhoneNumbersProps) {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 mx-auto">
      {phoneNumbers.map((phone, idx) => (
        <div key={`phone-${idx}`} className="flex items-center h-auto my-auto">
          <Link
            href={`tel:${phone}`}
            className="badge badge-primary py-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
            <span className="mr-1">{platformIcons.Phone}</span>{phone}
          </Link>
        </div>
      ))}
    </div>
  );
}