import prisma from "@/lib/db";

import Link from "next/link";
import Image from "next/image";

import { MySmartHealthInfo } from "@/utils/types";
import Divider from "../divider/Divider";


const getMySmartHealthInfo = async () => {
  const MySmartHealthData = await prisma.mySmartHealth.findFirst();
  return MySmartHealthData;
};

export default async function MySmartHealth() {
  const mySmartHealthInfo = await getMySmartHealthInfo();

  if (!mySmartHealthInfo) {
    return null;
  }
  const { generalTitle, paragraph } = mySmartHealthInfo as MySmartHealthInfo;

  return (
    <div className="collapse shadow-xl border border-primary rounded-2xl mb-6">
      <input type="checkbox" className="peer" />
      <div className="collapse-title flex items-center gap-3 font-bold text-xl">
        <Image
          src="/logo.png"
          alt="My Smart Health"
          width={40}
          height={40}
          loading="lazy"
          placeholder="empty"
          className="rounded-full "
          style={{ objectFit: "cover", width: "auto", height: "auto" }}
        />
        <span>MY SMART HEALTH</span>
      </div>
      <div className="collapse-content">
        {generalTitle && (
          <h2 className="text-2xl font-bold mb-4 text-primary">
            {generalTitle}
          </h2>
        )}
        {paragraph &&
          paragraph.map((para, index) => (
            <div
              key={index}
              className="card mb-6 p-4 rounded-xl"
            >
              {para.images && para.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {para.images.map((imgUrl, imgIndex) => (
                    <div key={imgIndex} className="avatar">
                      <div className="w-24 rounded-xl border border-primary">
                        <Image
                          src={imgUrl}
                          alt={para.title || `Image ${imgIndex + 1}`}
                          width={100}
                          height={100}
                          loading="lazy"
                          placeholder="empty"
                          style={{
                            width: 96,
                            height: 96,
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Divider addClass="my-2" />

              {para.title && (
                <h3 className="text-xl font-semibold p-4 mb-2">
                  <span className="badge badge-primary badge-outline text-lg font-semibold p-2 min-h-fit border-2">
                    {para.title}
                  </span>
                </h3>
              )}

              <p className="mb-3 whitespace-pre-line">{para.content}</p>

              <Divider addClass="my-2" />

              {para.files && para.files.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold mb-1">Dateien:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {para.files.map((fileUrl, fileIndex) => (
                      <li key={fileIndex}>
                        <Link
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary break-all"
                          download={true}
                        >
                          {fileUrl.split("/").pop()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}