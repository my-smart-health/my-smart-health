import Image from "next/image";
import Link from "next/link";
import NotrufDropdown from "./NotrufDropdown";
import ProKilMenu from "./ProKilMenu";
import { Suspense } from "react";

export default async function Navbar() {

  return (
    <>
      <nav
        draggable={false}
        className="flex flex-col mx-auto mb-1 w-full max-w-[90%]"
      >
        <div className="flex flex-row gap-1 items-center justify-evenly text-start text-nowrap">
          <Link
            draggable={false}
            href="/"
            className="flex flex-col items-start sm:items-center"
          >
            <div className="flex flex-row items-center justify-center text-xl font-bold uppercase">
              <Image
                priority
                loading="eager"
                draggable={false}
                src="/og-logo.jpg"
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
      <Suspense fallback={<div className="skeleton flex flex-row justify-evenly align-baseline h-full max-h-fit w-full max-w-[100%] gap-2 bg-primary text-white p-2 mb-4">Loading...</div>}>
        <ProKilMenu />
      </Suspense>
    </>
  )
}