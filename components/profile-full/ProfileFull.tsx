'use client';

import { useEffect, useState } from "react";
import { parseSocials } from "@/utils/common";
import { Certificate, ProfileNewsCarouselItem, Schedule } from "@/utils/types";
import Divider from "../divider/Divider";
import {
  ProfilePictureSection,
  FieldOfExpertiseSection,
  BioSection,
  NewsSection,
  ContactSection,
  ScheduleSection,
  ReservationSection,
  PrescriptionSection,
  CertificatesSection,
} from "./_components";

import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';

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
  schedule: Schedule[];
  certificates: Certificate[];
};

export default function ProfileFull({ user, posts }: { user: User, posts: ProfileNewsCarouselItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const {
    name,
    profileImages,
    address,
    bio,
    phone,
    socials,
    website,
    fieldOfExpertise,
    displayEmail,
    certificates,
    schedule = [],
  } = user || {};

  const parsedSocials = parseSocials(socials || []);

  return (
    <div className="flex flex-col gap-2 p-2 w-full max-w-[99%]">
      <ProfilePictureSection images={profileImages} />

      <section>
        <h2 className="font-bold text-primary text-xl">{name}</h2>
      </section>

      <FieldOfExpertiseSection fieldOfExpertise={fieldOfExpertise} />

      <BioSection bio={bio ?? ""} />

      <NewsSection posts={posts} />

      <Divider />

      <h2 className="font-bold text-primary text-xl">Kontakt</h2>
      <ContactSection
        phone={phone}
        displayEmail={displayEmail}
        website={website}
        parsedSocials={parsedSocials}
        address={address}
        platformIcons={platformIcons}
      />

      <CertificatesSection certificates={certificates} />

      {schedule.length > 0 && (
        <>
          <Divider />
          <section>
            <ScheduleSection schedule={schedule} />
          </section>
        </>
      )}

      <ReservationSection />

      <PrescriptionSection />


    </div>
  );
}