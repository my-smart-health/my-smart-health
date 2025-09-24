import prisma from "@/lib/db";
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
    <div className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300 rounded-2xl mb-6">
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
          style={{ width: 40, height: 40 }}
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
              className="card bg-base-200 shadow-md mb-6 p-4 rounded-xl"
            >
              {para.images && para.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {para.images.map((imgUrl, imgIndex) => (
                    <div key={imgIndex} className="avatar">
                      <div className="w-24 rounded-xl border border-primary">
                        <Image
                          src={imgUrl}
                          alt={para.title}
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

              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="badge badge-primary badge-outline">
                  {para.title}
                </span>
              </h3>

              <p className="mb-3 whitespace-pre-line">{para.content}</p>

              <Divider addClass="my-2" />

              {para.files && para.files.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold mb-1">Dateien:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {para.files.map((fileUrl, fileIndex) => (
                      <li key={fileIndex}>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary break-all"
                          download
                        >
                          {fileUrl.split("/").pop()}
                        </a>
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