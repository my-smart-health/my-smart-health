
import Image from "next/image";
import Link from "next/link";
import NotrufDropdown from "./NotrufDropdown";

export default function Navbar() {

  return (
    <nav
      draggable={false}
      className="flex flex-col justify-evenly mb-4 w-full max-w-xs sm:max-w-xs md:max-w-sm"
    >
      <div className="flex flex-row gap-1 items-center justify-evenly text-start text-nowrap">
        <Link
          draggable={false}
          href="/"
          className="flex flex-col items-start sm:items-center"
        >
          <div className="flex flex-row items-center justify-center text-xl font-bold uppercase bg-white">
            My Smart
            <Image
              priority
              draggable={false}
              src="/logo.png"
              alt="My Smart Health"
              width={32}
              height={32}
              className="w-10 h-auto mx-1"
            />
            Health
          </div>
          <div className="text-xs font-medium text-neutral-600 uppercase bg-white">
            Wir machen Düsseldorf gesünder
          </div>
        </Link>
        <NotrufDropdown />
      </div>
    </nav>
  )
}