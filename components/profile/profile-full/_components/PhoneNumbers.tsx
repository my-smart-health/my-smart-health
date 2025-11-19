import React from "react";
import Divider from "@/components/divider/Divider";
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
    <>
      <div className="flex flex-wrap gap-2 mx-auto ">
        {phoneNumbers.length > 0 && phoneNumbers.map((phone, idx) => (
          <React.Fragment key={`phone-${idx}`}>
            {idx === 0 && <Divider addClass="my-1" />}
            <div className="flex items-center h-auto my-auto">
              <Link
                href={`tel:${phone}`}
                className="badge badge-primary py-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                <span className="mr-1">{platformIcons.Phone}</span>{phone}
              </Link>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}