import Image from "next/image";
import Link from "next/link";
import { Membership } from "@/utils/types";

type MembershipSectionProps = {
  membership: Membership;
};

export default function MembershipSection({ membership }: MembershipSectionProps) {
  const { link } = membership;

  return (
    <Link href={link} target="_self" className="mx-auto flex gap-2 rounded">
      <Image
        src="/termine-kurzfristig-neutral.png"
        alt="Termine Kurzfristig Icon"
        width={120}
        height={120}
        style={{ width: "auto", height: "auto" }}
        className="inline-block"
      />
    </Link>
  );
}