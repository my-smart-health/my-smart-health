import Image from "next/image";

export default function NotrufButton() {

  return (
    <details className="dropdown dropdown-end border-0">
      <summary className="btn btn-square m-1 border-0 h-16 w-16 bg-white hover:bg-white shadow-none">
        <Image
          priority
          draggable={false}
          src="/icon1.png"
          alt="Notruf"
          width={64}
          height={64}
          className={`w-16 h-16 hover:scale-110 transition-transform ease-in-out shadow-lg shadow-[#2a2a2ad9]`} />
      </summary>
      <ul className={`menu dropdown-content mr-1 w-64 p-0 bg-white text-xl font-black z-1 shadow-lg shadow-[#2a2a2ad9] border-6 border-[#2db9bc]`}>
        <li>
          <a
            href="tel:112"
            className={`hover:underline cursor-pointer border-b-2 px-5 py-2 border-[#2db9bc]`}
          >
            Notruf<br />112
          </a>
        </li>
        <li><a
          href="tel:116117"
          className={`hover:underline cursor-pointer border-b-2 px-5 py-2 border-[#2db9bc]`}
        >
          Bereitschaftsarzt<br />116117
        </a></li>
        <li><a
          href="tel:19222"
          className="hover:underline cursor-pointer px-5 py-2"
        >
          Krankentransport<br />19222
        </a></li>
      </ul>
    </details >
  )
}