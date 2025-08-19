import { BORDER_COLOR, SHADOW_COLOR } from "@/utils/constants";
import Image from "next/image";

export default function NotrufButton() {

  return (
    <details className="dropdown dropdown-end border-0">
      <summary className="btn btn-square m-1 border-0 h-16 w-16 bg-white hover:bg-white shadow-none">
        <Image
          draggable={false}
          src="/icon1.png"
          alt="Notruf"
          width={64}
          height={55}
          className={`hover:scale-110 transition-transform ease-in-out shadow-lg shadow-[${SHADOW_COLOR}]`} />
      </summary>
      <ul className={`menu dropdown-content mr-1 w-fit bg-white text-xl font-black z-1 shadow-lg shadow-[${SHADOW_COLOR}] border-6 border-[${BORDER_COLOR}]`}>
        <li>
          <a
            href="tel:112"
            className={`hover:underline cursor-pointer border-b-2 px-4 py-2 border-[${BORDER_COLOR}]`}
          >
            Notruf<br />112
          </a>
        </li>
        <li><a
          href="tel:116117"
          className={`hover:underline cursor-pointer border-b-2 px-4 py-2 border-[${BORDER_COLOR}]`}
        >
          Bereitschaftsarzt<br />116117
        </a></li>
        <li><a
          href="tel:19222"
          className="hover:underline cursor-pointer px-4 py-2"
        >
          Krankentransport<br />19222
        </a></li>
      </ul>
    </details >
  )
}
{/* <button
        draggable={false}
        onClick={handleClick}
        className="cursor-pointer">
        <Image
          draggable={false}
          src="/icon1.png"
          alt="Notruf"
          width={60}
          height={55}
          className="hover:scale-110 transition-transform ease-in-out shadow-lg shadow-black/60" />
      </button>
      <div
        className={`flex flex-col absolute top-26 right-1 border-5 text-xl font-extrabold bg-white border-[#2db9bc] shadow-xl shadow-[#2a2a2ad9] transition-all ease-in-out duration-1000`}
      >
        <a
          href="tel:112"
          className="hover:underline cursor-pointer border-b-2 px-6 py-2 border-[#2db9bc]"
        >
          Notruf<br />112
        </a>
        <a
          href="tel:116117"
          className="hover:underline cursor-pointer border-b-2 px-6 py-2 border-[#2db9bc]"
        >
          Bereitschaftsarzt<br />116117
        </a>
        <a
          href="tel:19222"
          className="hover:underline cursor-pointer border-b-2 px-6 py-2 border-[#2db9bc]"
        >
          Krankentransport<br />19222
        </a>
      </div> */}