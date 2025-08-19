
import Image from "next/image";
import Link from "next/link";
import NotrufDropdown from "./NotrufDropdown";

export default function Navbar() {

  return (
    <nav
      draggable={false}
      className="flex flex-row items-center justify-between gap-4 w-full">
      <Link
        draggable={false}
        href="/">
        <Image
          priority
          draggable={false}
          src="/Logo.jpg"
          alt="My Smart Health"
          width={350}
          height={112}
          className="w-96 h-auto p-4"
        />
      </Link>
      <NotrufDropdown />
    </nav>
  )
}