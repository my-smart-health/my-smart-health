import Image from "next/image";
import Link from "next/link";
import React from "react";

type NewsSmartHealthMedizinButtonProps = {
  name: string;
  icon?: string | React.ReactNode;
  goTo: string;
  active?: boolean;
  imageAsTitle?: string;
};

export default function NewsSmartHealthMedizinButton({ name, icon, goTo, active, imageAsTitle }: NewsSmartHealthMedizinButtonProps) {
  return (
    <Link href={goTo} className={`flex flex-row ${imageAsTitle ? "" : "h-15"} w-full max-w-[100%] rounded-2xl border shadow-xl`}>
      {imageAsTitle ? (
        <div className={`flex flex-col items-center  justify-center w-full ${active ? 'bg-secondary rounded-2xl' : ''}`}>
          <Image priority loading="eager" src={imageAsTitle} width={150} height={150} alt={`${name} icon`} style={{ objectFit: "contain", width: "auto", height: "auto" }} className={`w-auto h-auto mx-auto py-4 ${active ? 'bg-secondary rounded-2xl' : ''}`} />
          <div className={`w-full mx-auto border h-0 max-w-[90%] `}></div>
          <Image
            src="/termine-kurzfristig-neutral.png"
            alt="Termine Kurzfristig Icon"
            width={65}
            height={65}
            style={{ width: "auto", height: "auto" }}
            className="inline-block my-4"
          />
        </div>
      ) : (
        <>
          <div className="w-14 rounded-tl-2xl rounded-bl-2xl flex items-center p-2 justify-center bg-primary text-white">
            {typeof icon === "string" ? (
              <Image priority loading="eager" src={icon} width={26} height={26} alt={`${name} icon`} style={{ objectFit: "contain", width: "auto", height: "auto" }} className="w-7 h-7 bg-primary text-white" />
            ) : (
              icon
            )}
          </div>
          <div className={`flex items-center justify-start pl-2.5 font-bold text-xl text-[#2c2e35]  w-full ${active && 'bg-secondary rounded-br-2xl rounded-tr-2xl'}`}>{name}</div>
        </>
      )
      } </Link>
  );
}
