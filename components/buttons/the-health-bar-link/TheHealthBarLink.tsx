import Image from "next/image";
import Link from "next/link";

export default function TheHealthBarLink() {
  return (
    <Link
      draggable={false}
      href="/the-health-bar"
      className="flex justify-center items-center w-full mx-auto max-w-[90%]"
      title="The Health Bar"
    >
      <Image
        src="/unserHealthShop.png"
        alt="The Health Bar"
        width={800}
        height={150}
        className="w-full h-auto border-2 border-primary rounded-2xl p-4 mt-4"
        style={{ objectFit: "contain" }}
      />
    </Link>
  );
}
