import prisma from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

import { MySmartHealthInfo } from '@/utils/types';
import Divider from '../divider/Divider';
import { File } from 'lucide-react';
import GoToButton from '../buttons/go-to/GoToButton';
import { auth } from '@/auth';
import SeeMoreLess from '../buttons/see-more-less/SeeMoreLess';

import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube } from "lucide-react";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import MSHLocations from './_components/MSHLocations';

const getMySmartHealthInfo = async () => {
  return prisma.mySmartHealth.findFirst();
};

function getFileName(fileUrl: string) {
  try {
    const u = new URL(fileUrl);
    u.searchParams.delete('download');
    const parts = u.pathname.split('/');
    return decodeURIComponent(parts.pop() || '');
  } catch {
    const stripped = String(fileUrl).split(/[?#]/)[0];
    return stripped.replace(/^.*[\\\/]/, '');
  }
}

function getLocations() {
  const locations = prisma.mySmartHealthLocation.findMany();
  return locations;
}

export default async function MySmartHealth() {
  const mySmartHealthInfo = (await getMySmartHealthInfo()) as MySmartHealthInfo | null;
  const locations = await getLocations();
  const session = await auth();

  if (!mySmartHealthInfo) return null;

  const { generalTitle, paragraph } = mySmartHealthInfo;

  const platformIcons: Record<string, React.ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={30} />,
    Website: <Globe className="inline-block mr-1" size={30} />,
    Phone: <Phone className="inline-block mr-1" size={20} />,
    Facebook: <Facebook className="inline-block mr-1" size={30} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={30} />,
    X: <Image src={Xlogo} width={30} height={30} alt="X.com" className="w-6 mr-1" />,
    Youtube: <Youtube className="inline-block mr-1" size={30} />,
    TikTok: <Image src={TikTokLogo} width={30} height={30} alt="TikTok" className="w-8 -ml-1" />,
    Instagram: <Instagram className="inline-block mr-1" size={30} />,
  };

  return (
    <>
      <div className="collapse shadow-xl border-2 border-primary rounded-2xl mb-6">

        <input type="checkbox" className="peer" />
        <div className="collapse-title flex items-center gap-3 font-bold text-xl">
          <Image
            src="/navbar.jpg"
            alt="My Smart Health"
            width={150}
            height={60}
            loading="lazy"
            placeholder="empty"
            style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}
          />
        </div>

        {session?.user.role === 'ADMIN' && <GoToButton src="/dashboard/edit-my-smart-health" name="Edit My Smart Health Info" className="z-10 btn btn-sm btn-primary bg-green-500 hover:bg-green-500/75" />}

        <div className="collapse-content">
          {generalTitle && (
            <h2 className="text-2xl font-bold mb-4 text-primary">{generalTitle}</h2>
          )}

          {paragraph?.map((para, index) => (
            <div key={para.id ?? index} className="card mb-6 p-4 rounded-xl">
              {para.images && para.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {para.images.map((imgUrl, imgIndex) => (
                    <div key={imgIndex} className="avatar">
                      <div className="w-52 rounded-xl border border-primary">
                        <Image
                          src={imgUrl}
                          alt={para.title || `Image ${imgIndex + 1}`}
                          width={100}
                          height={100}
                          loading="lazy"
                          placeholder="empty"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {para.title && (
                <>
                  <Divider addClass="my-2" />
                  <h3 className="text-xl font-semibold p-4 mb-2">
                    <span className="badge badge-primary badge-outline text-lg font-semibold p-2 min-h-fit border-2">
                      {para.title}
                    </span>
                  </h3>
                </>
              )}

              <SeeMoreLess text={para.content} lines={1} />

              {para.files && para.files.length > 0 && (
                <div >
                  <Divider addClass="my-2" />
                  <h4 className="font-semibold mb-1">Dateien:</h4>
                  <ul className="list-none">
                    <section className="grid grid-cols-1 gap-3">
                      {para.files.map((fileUrl, fileIndex) => {
                        const fileName = getFileName(fileUrl);
                        return (
                          <li key={fileIndex} className="grid grid-rows-1 items-center gap-2">
                            <div key={fileUrl + fileIndex} className="flex items-center w-full h-auto my-auto">
                              <Link
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="badge badge-primary p-5 text-white w-fit hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link"
                                download={true}
                              >
                                <File /> {fileName}
                              </Link>
                            </div>
                          </li>
                        );
                      })}
                    </section>
                  </ul>
                </div>
              )}

              {para.socialLinks && para.socialLinks.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {para.socialLinks.map((social, socialIdx) => (
                      <Link
                        key={socialIdx}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="badge badge-primary p-5 text-white w-full hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link"
                      >
                        <span className="mr-1">{platformIcons[social.platform]}</span>
                        {social.platform}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <MSHLocations
            phoneNumbers={[]}
            locations={locations || []}
            parsedSocials={[]}
            platformIcons={platformIcons}
          />
        </div>
      </div>
    </>
  );
}