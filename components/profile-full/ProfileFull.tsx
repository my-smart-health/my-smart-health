import Link from "next/link";
import Image from "next/image";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube, MapPin, CalendarPlus2 } from "lucide-react";


import ScheduleSection from "./ScheduleSection";
import SeeMoreLess from "../buttons/see-more-less/SeeMoreLess";
import ProfilePictureCarousel from "../carousels/profile-picture-carousel/ProfilePictureCarousel";

import { Certificates, Schedule } from "@/utils/types";
import { parseSocials } from "@/utils/common";
import prisma from "@/lib/db";
import ProfileNewsCarousel from "../carousels/profile-news/ProfileNewsCarousel";
import Divider from "../divider/Divider";
import CertificateList from "./CertificateList";

type User = {
  name: string | null;
  profileImages: string[];
  address: string | null;
  bio: string | null;
  phone: string[];
  socials: string[];
  website: string | null;
  fieldOfExpertise: string[];
  displayEmail: string | null;
  id: string;
  schedule: Schedule[]
  certificates: Certificates[];
};

const platformIcons: Record<string, React.ReactNode> = {
  Email: <AtSign className="inline-block mr-1" size={20} />,
  Website: <Globe className="inline-block mr-1" size={20} />,
  Phone: <Phone className="inline-block mr-1" size={20} />,
  Facebook: <Facebook className="inline-block mr-1" size={20} />,
  Linkedin: <Linkedin className="inline-block mr-1" size={20} />,
  X: <Image src={Xlogo} width={20} height={20} alt="X.com" className="w-6 mr-1" />,
  Youtube: <Youtube className="inline-block mr-1" size={20} />,
  TikTok: <Image src={TikTokLogo} width={20} height={20} alt="TikTok" className="w-8 -ml-1" />,
  Instagram: <Instagram className="inline-block mr-1" size={20} />,
};

async function getAllPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      photos: true,
      authorId: true,
    }
  })

  return posts;
}

export default async function ProfileFull({ user }: { user: User }) {

  const { name, profileImages, address, bio, phone, socials, website, fieldOfExpertise, displayEmail, certificates } = user || {};

  const posts = await getAllPosts(user.id);


  const schedule = user?.schedule as Schedule[] || [];

  const parsedSocials = parseSocials(socials || []);

  return (
    <>
      <div className="flex flex-col gap-2 p-2 w-full max-w-[99%]">

        {
          profileImages.length > 0 && <section className="max-w-[90%] mx-auto">
            <ProfilePictureCarousel imageSrcArray={profileImages} />
          </section>
        }

        <section>
          <h2 className="font-bold text-primary text-xl">{name}</h2>
        </section>

        {fieldOfExpertise.length > 0 && (
          <>
            <section>
              <p className="font-semibold">
                {fieldOfExpertise?.join(", ")}
              </p>
            </section>
            <Divider />
          </>
        )}

        {bio && <section className="">
          <article className="text-base">
            <SeeMoreLess text={bio} />
          </article>
        </section>
        }

        <Divider />

        {posts && posts.length > 0 && (
          <>
            <h2 className="font-bold text-primary text-xl">News</h2>
            <section className="w-full">
              <ProfileNewsCarousel props={posts} />
            </section>
          </>
        )}

        <Divider />

        <h2 className="font-bold text-primary text-xl">Kontakt</h2>
        <section className="grid grid-cols-1 gap-3">
          {phone && (
            <Link
              href={`tel:${phone}`}
              target="_blank"
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 link">
              <span className="mr-1">{platformIcons.Phone}</span>{phone}
            </Link>
          )}
          {displayEmail && (
            <Link
              href={`mailto:${displayEmail}`}
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
              <span className="mr-1">{platformIcons.Email}</span>{displayEmail}
            </Link>
          )}

          {website && (
            <Link
              href={website}
              target="_blank"
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
              <span className="mr-1">{platformIcons.Website}</span>{website}
            </Link>
          )}

          {parsedSocials.length > 0 && parsedSocials.map((social, idx) => (
            <div
              key={social.url + idx}
              className="flex items-center w-full h-auto my-auto">
              <Link
                href={social.url}
                target="_blank"
                className="flex justify-center items-center text-gray-700 hover:text-primary transition-colors duration-200 break-all link max-w-[99%]">
                <span className="mr-1">{platformIcons[social.platform]}</span>{social.url}
              </Link>
            </div>
          ))}

          {address && (
            <div className="flex flex-col">
              <div><MapPin className="inline-block mr-1" size={20} /> {address}</div>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                className="indent-7 text-primary font-bold text-lg hover:text-primary transition-colors duration-200"
              >
                Route planen
              </Link>
            </div>
          )}
        </section>
        <section>
          {schedule && schedule.length > 0 && (
            <>
              <Divider />

              <section>
                <ScheduleSection schedule={schedule} />
              </section>
            </>
          )}
        </section>

        <section className="flex flex-col w-full">
          <div className="font-semibold text-primary text-2xl text-center">Rezept</div>

          <Divider addClass="my-4" />

          <div className="flex align-middle w-full mb-8">
            <Link
              href="https://moers.cms.shic.us/Arzttemin_reservieren"
              target="_blank"
              className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
            >
              <CalendarPlus2 /> <span>online Termine - Reservierung</span>
            </Link>
          </div>
        </section>

        {certificates && certificates.length > 0 && (
          <>
            <Divider />
            <section>
              <h2 className="font-bold text-primary text-xl">Zertifikate</h2>
              <CertificateList certificates={certificates} />
            </section>
          </>
        )}
      </div>
    </>
  )
}