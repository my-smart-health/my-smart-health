import Image from "next/image";
import Link from "next/link";

export default function TheHealthBarLink() {
  return (
    <Link draggable={false} href="/health-bar" className="max-w-sm">
      <Image loading="lazy" placeholder="empty" src="/healthbar.png" alt="Health Bar Icon" width={300} height={130} className="max-w-sm h-[130px]" />
    </Link>
  );
}
