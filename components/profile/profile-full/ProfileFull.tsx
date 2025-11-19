'use client';

import { useEffect, useState } from "react";
import { parseSocials } from "@/utils/common";
import { Certificate, FieldOfExpertise, ProfileNewsCarouselItem, ReservationLink, Schedule } from "@/utils/types";

import {
  ProfilePictureSection,
  FieldOfExpertiseSection,
  BioSection,
  NewsSection,
  ContactSection,
  ScheduleSection,
  CertificatesSection,
  PrescriptionReservation,
  PhoneNumbers,
  SocialLinks,
  UploadedFilesSection,
} from "./_components";

import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { Location } from "@/utils/types";
import Divider from "@/components/divider/Divider";

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

type User = {
  name: string | null;
  profileImages: string[];
  profileFiles: string[];
  bio: string | null;
  socials: string[];
  website: string | null;
  fieldOfExpertise: FieldOfExpertise[] | null;
  displayEmail: string | null;
  id: string;
  phones: string[];
  locations: Location[];
  schedule: Schedule[];
  certificates: Certificate[];
  reservationLinks?: ReservationLink[] | null;
};

export default function ProfileFull({ user, posts }: { user: User, posts: ProfileNewsCarouselItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const {
    name,
    profileImages,
    profileFiles = [],
    bio,
    socials,
    website,
    fieldOfExpertise,
    displayEmail,
    certificates,
    locations,
    schedule = [],
    phones = [],
    reservationLinks = [],
  } = user || {};

  const parsedSocials = parseSocials(socials || []);

  const filteredLocations = (locations || []).filter(loc => loc.address && loc.address.trim() !== "");

  return (
    <div className="flex flex-col gap-3 p-2 sm:p-3 w-full max-w-full overflow-hidden">

      <section className="flex flex-wrap gap-2 w-full">
        <h2 className="font-bold text-primary text-xl break-words">{name}</h2>
        <div className="my-auto w-full">
          <FieldOfExpertiseSection fieldOfExpertise={fieldOfExpertise} />
        </div>
      </section>

      <ProfilePictureSection images={profileImages} />

      <BioSection bio={bio ?? ""} />

      <UploadedFilesSection profileFiles={profileFiles} />

      <NewsSection posts={posts} />

      <CertificatesSection certificates={certificates} />

      <ContactSection
        phoneNumbers={phones}
        locations={filteredLocations}
        platformIcons={platformIcons}
      />


      {schedule.length > 0 && <ScheduleSection schedule={schedule} />}

      <PrescriptionReservation reservationLinks={reservationLinks || undefined} />

      <PhoneNumbers phoneNumbers={phones} platformIcons={platformIcons} />

      {((displayEmail || website || parsedSocials.length > 0) && phones.length === 0) && (
        <Divider addClass="my-1" />
      )}

      <SocialLinks
        displayEmail={displayEmail}
        website={website}
        parsedSocials={parsedSocials}
        platformIcons={platformIcons}
      />
    </div>
  );
}