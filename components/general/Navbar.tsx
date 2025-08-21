
import Image from "next/image";
import Link from "next/link";
import NotrufDropdown from "./NotrufDropdown";

export default function Navbar() {

  return (
    <nav
      draggable={false}
      className="flex flex-col mx-auto mb-4 w-full max-w-[90%] z-10"
    >
      <div className="flex flex-row gap-1 items-center justify-evenly text-start text-nowrap">
        <Link
          draggable={false}
          href="/"
          className="flex flex-col items-start sm:items-center"
        >
          <div className="flex flex-row items-center justify-center text-xl font-bold uppercase bg-white">
            <Image
              priority
              draggable={false}
              src="/Logo.jpg"
              alt="My Smart Health"
              width={350}
              height={112}
              className="w-96 h-auto mx-auto"
            />
          </div>
        </Link>
        <NotrufDropdown />
      </div>
    </nav>
  )
}