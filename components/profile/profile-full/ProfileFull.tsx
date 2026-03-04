'use client';

import { useEffect, useState } from "react";
import { parseSocials } from "@/utils/common";
import { Certificate, FieldOfExpertise, Membership, ProfileNewsCarouselItem, ReservationLink, Schedule } from "@/utils/types";

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
import GoBack from "@/components/buttons/go-back/GoBack";
import RatingStars from "@/components/common/RatingStars";

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
  membership: Membership | null;
  reservationLinks?: ReservationLink[] | null;
  ratingStars?: number | null;
  ratingLink?: string | null;
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
    membership,
    ratingStars,
    ratingLink
  } = user || {};

  const parsedSocials = parseSocials(socials || []);

  const filteredLocations = (locations || []).filter(loc => loc.address && loc.address.trim() !== "");

  const hasRatingStars = ratingStars !== null && ratingStars !== undefined;
  const hasFieldOfExpertise = fieldOfExpertise && fieldOfExpertise.length > 0;
  const hasProfileImages = profileImages && profileImages.length > 0;
  const hasBio = bio && bio.length > 0;
  const hasProfileFiles = profileFiles && profileFiles.length > 0;
  const hasPosts = posts && posts.length > 0;
  const hasCertificates = certificates && certificates.length > 0;
  const hasLocations = filteredLocations && filteredLocations.length > 0;
  const hasSchedule = schedule && schedule.length > 0;
  const hasValidReservationLinks = (reservationLinks || []).some(
    (linkItem) => typeof linkItem.url === "string" && linkItem.url.trim().length > 0
  );
  const hasActiveMembership = Boolean(membership?.status);
  const hasReservationOrMembership = hasValidReservationLinks || hasActiveMembership;
  const hasPhones = phones && phones.length > 0;
  const hasSocials = displayEmail || website || parsedSocials.length > 0;

  const dividerNeeded = (position: number) => {
    const sections = [
      hasRatingStars,
      hasFieldOfExpertise,
      hasProfileImages,
      hasBio,
      hasProfileFiles,
      hasPosts,
      hasCertificates,
      hasLocations,
      hasSchedule,
      hasReservationOrMembership,
      hasPhones,
      hasSocials
    ];

    const hasPreviousSection = sections.slice(0, position - 1).some(section => section);

    return hasPreviousSection ? <Divider addClass="my-1" /> : null;
  }

  return (
    <div className="flex flex-col gap-1 p-2 sm:p-3 w-full max-w-full overflow-hidden">

      <section className="flex flex-col gap-2 w-full">

        <div className="flex justify-between items-center w-full gap-2">
          <h2 className="font-bold self-end text-primary text-xl break-words">{name}</h2>
          <GoBack />
        </div>
        <div className="flex flex-col">
          {hasRatingStars && <RatingStars id={user.id} stars={ratingStars} ratingLink={ratingLink} />}
        </div>
      </section>

      {hasFieldOfExpertise && (
        <>
          {dividerNeeded(1)}
          <div className="w-full flex justify-center sm:justify-start">
            <FieldOfExpertiseSection fieldOfExpertise={fieldOfExpertise} />
          </div>
        </>
      )}

      {hasProfileImages && (
        <>
          {dividerNeeded(2)}
          <ProfilePictureSection images={profileImages} />
        </>
      )}

      {hasBio && (
        <>
          {dividerNeeded(3)}
          <BioSection bio={bio ?? ""} />
        </>
      )}

      {hasProfileFiles && (
        <>
          {dividerNeeded(4)}
          <UploadedFilesSection profileFiles={profileFiles} />
        </>
      )}

      {hasPosts && (
        <>
          {dividerNeeded(5)}
          <NewsSection posts={posts} />
        </>
      )}

      {hasCertificates && (
        <>
          {dividerNeeded(6)}
          <CertificatesSection certificates={certificates} />
        </>
      )}

      {hasLocations && (
        <>
          {dividerNeeded(7)}
          <ContactSection
            phoneNumbers={phones}
            locations={filteredLocations}
            platformIcons={platformIcons}
          />
        </>
      )}

      {hasSchedule && (
        <>
          {dividerNeeded(8)}
          <ScheduleSection schedule={schedule} />
        </>
      )}

      {hasReservationOrMembership && (
        <>
          {dividerNeeded(9)}
          <PrescriptionReservation reservationLinks={reservationLinks} membership={membership} />
        </>
      )}

      {hasPhones && (
        <>
          {dividerNeeded(10)}
          <PhoneNumbers phoneNumbers={phones} platformIcons={platformIcons} />
        </>
      )}

      {hasSocials && (
        <>
          {dividerNeeded(11)}
          <SocialLinks
            displayEmail={displayEmail}
            website={website}
            parsedSocials={parsedSocials}
            platformIcons={platformIcons}
          />
        </>
      )}
    </div>
  );
}