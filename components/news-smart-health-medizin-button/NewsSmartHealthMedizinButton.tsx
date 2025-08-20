import Image from "next/image";
import Link from "next/link";

type NewsSmartHealthMedizinButtonProps = {
  name: string;
  icon: string;
  goTo: string;
};

export default function NewsSmartHealthMedizinButton({ name, icon, goTo }: NewsSmartHealthMedizinButtonProps) {
  return (
    <Link href={goTo} className="flex flex-row h-15 rounded-2xl border shadow-xl max-w-sm">
      <div className="w-14 rounded-tl-2xl rounded-bl-2xl flex items-center justify-center bg-[#2db9bc] text-white">
        <Image priority src={icon} width={26} height={26} alt={`${name} icon`} className="w-7 h-7 bg-[#2db9bc] text-white" />
      </div>
      <div className="flex items-center justify-start pl-2.5 font-bold text-xl text-[#2c2e35]">{name}</div>
    </Link>
  );
}
