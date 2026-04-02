import Image from "next/image";
import Link from "next/link";
import { Membership } from "@/utils/types";

type MembershipSectionProps = {
  membership: Membership;
};

export default function MembershipSection({ membership }: MembershipSectionProps) {
  const { link } = membership;

  return (
    <>
      <Link href={link} target="_self" className="btn text-black bg-white hover:bg-primary/20 rounded-lg my-auto mx-auto h-14 min-w-44 max-w-44">
        <Image
          src="/buttons/termine.png"
          alt="Termine Kurzfristig Icon"
          width={208}
          height={208}
          style={{ width: "auto", height: "auto" }}
          className="inline-block max-w-44"
        />
      </Link>
    </>
  );
}