import Image from "next/image";
import Link from "next/link";

export default function TheHealthBarLink() {
  return (
    <Link
      draggable={false}
      href="/the-health-bar"
      className="flex justify-center w-full mx-auto max-w-[90%]"
      title="The Health Bar"
    >
      <Image
        loading="lazy"
        placeholder="empty"
        src="/healthbar.png"
        alt="Health Bar Icon"
        width={410}
        height={130}
        style={{ width: "100%", height: "auto" }}
      />
    </Link>
  );
}
