import Image from "next/image";
import Link from "next/link";

type NewsSmartHealthMedizinButtonProps = {
  name: string;
  icon: string;
  goTo: string;
  active?: boolean;
};

export default function NewsSmartHealthMedizinButton({ name, icon, goTo, active }: NewsSmartHealthMedizinButtonProps) {
  return (
    <Link href={goTo} className="flex flex-row h-15 w-full max-w-[100%] rounded-2xl border shadow-xl">
      <div className="w-14 rounded-tl-2xl rounded-bl-2xl flex items-center justify-center bg-primary text-white">
        <Image priority src={icon} width={26} height={26} alt={`${name} icon`} className="w-7 h-7 bg-primary text-white" />
      </div>
      <div className={`flex items-center justify-start pl-2.5 font-bold text-xl text-[#2c2e35]  w-full ${active && 'bg-secondary rounded-br-2xl rounded-tr-2xl'}`}>{name}</div>
    </Link>
  );
}
