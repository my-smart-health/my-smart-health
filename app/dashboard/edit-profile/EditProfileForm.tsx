'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { MouseEvent, Suspense, useEffect, useRef, useState, ChangeEvent } from "react";
import { PutBlobResult } from "@vercel/blob";

import { Certificate, CertificateForm, Schedule, Social } from "@/utils/types";
import { parseSocials, serializeSocials } from "@/utils/common";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube, ArrowUpRight } from "lucide-react";

import Divider from "@/components/divider/Divider";
import { MAX_FILES_PER_USER } from "@/utils/constants";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";

import { NameSection } from "./_components/NameSection";
import { BioSection } from "./_components/BioSection";
import { AddressSection } from "./_components/AddressSection";
import { PhoneNumbersSection } from "./_components/PhoneNumbersSection";
import { EmailSection } from "./_components/EmailSection";
import { WebsiteSection } from "./_components/WebsiteSection";
import { SocialsSection } from "./_components/SocialsSection";
import { ProfileMediaCarousel } from "./_components/ProfileMediaCarousel";
import { ProfileMediaUpload } from "./_components/ProfileMediaUpload";
import { ProfileMediaList } from "./_components/ProfileMediaList";
import { MediaUrlSection } from "./_components/MediaUrlSection";
import { AreaOfExpertiseSection } from "./_components/AreaOfExpertiseSection";
import { CertificatesSection } from "./_components/CertificatesSection";
import { WorkScheduleSection } from "./_components/WorkScheduleSection";

type User = {
  id: string;
  phone: string[];
  socials: string[];
  bio: string | null;
  name: string | null;
  profileImages: string[] | null;
  address: string | null;
  website: string | null;
  fieldOfExpertise: string[];
  displayEmail: string | null;
  schedule: Schedule[] | null;
  certificates: Certificate[] | null;
}

export default function EditProfileForm({ user }: { user: User }) {

  const MEDIA_WIDTH = 200;
  const MEDIA_HEIGHT = 200;

  const redirect = useRouter();

  const bioRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const certificatesRef = useRef<HTMLTextAreaElement>(null);

  const [userData, setUserData] = useState<User>(user);

  const [fieldOfExpertise, setFieldOfExpertise] = useState<string[]>(user.fieldOfExpertise || []);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(user.phone || []);
  const [socials, setSocials] = useState<Social[]>(parseSocials(user.socials || []));
  const [schedule, setSchedule] = useState<Schedule[]>(user.schedule || [{
    id: crypto.randomUUID(),
    day: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false
    },
    open: '',
    close: ''
  }]);

  const [error, setError] = useState<string | null>(null);

  const [bio, setBio] = useState(user.bio || "");
  const [address, setAddress] = useState(user.address || "");
  const [displayEmail, setDisplayEmail] = useState(user.displayEmail || "");
  const [website, setWebsite] = useState(user.website || "");
  const [blobResult, setBlobResult] = useState<string[]>(userData.profileImages || []);

  const [certificates, setCertificates] = useState<CertificateForm[]>(user.certificates?.map(cert => ({ ...cert })) || []);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  const platformIcons: Record<string, React.ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={20} />,
    Website: <Globe className="inline-block mr-1" size={20} />,
    Phone: <Phone className="inline-block mr-1" size={20} />,
    Facebook: <Facebook className="inline-block mr-1" size={20} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={20} />,
    X: <Image src={Xlogo} width={20} height={20} alt="X.com" className="w-6 mr-1" />,
    Youtube: <Youtube className="inline-block mr-1" size={20} />,
    TikTok: <Image src={TikTokLogo} width={20} height={20} alt="TikTok" className="w-10 mr-1" />,
    Instagram: <Instagram className="inline-block mr-1" size={20} />,
  };

  useEffect(() => {
    if (blobResult.length > 0) {
      setIsImageFirst(
        blobResult[0].search("instagram") === -1 &&
        blobResult[0].search("youtube") === -1 &&
        blobResult[0].search("youtu") === -1
      );
    }
  }, [blobResult]);

  useEffect(() => {
    const resize = (el: HTMLTextAreaElement | null, value: string) => {
      if (el) {
        el.style.height = "auto";
        if (value) el.style.height = el.scrollHeight + "px";
      }
    };
    resize(bioRef.current, bio);
    resize(addressRef.current, address);
  }, [bio, address]);

  const toggleScheduleDay = (id: string, day: keyof Schedule['day']) => {
    setSchedule(schedule.map(schedule => schedule.id === id ? { ...schedule, day: { ...schedule.day, [day]: !schedule.day[day] } } : schedule));
  };

  const setScheduleTime = (id: string, openClose: keyof Schedule, value: string) => {
    setSchedule(schedule.map(schedule => schedule.id === id ? { ...schedule, [openClose]: value.toString() } : schedule));
  };

  const handleAddURL = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');

    if (!form) return;
    const formData = new FormData(form);
    const mediaUrl = formData.get(`media`)?.toString().trim();

    if (!mediaUrl || mediaUrl.length === 0) {
      setError('Media URL cannot be empty');
      return;
    }

    setError(null);
    setBlobResult([...blobResult, mediaUrl]);
    const resetMediaInput = form.querySelector('input[name="media"]') as HTMLInputElement;
    resetMediaInput.value = '';
  };

  const handleUploadProfileImages = async (files: FileList) => {
    try {
      setIsDisabled(true);
      const uploadedUrls: string[] = [];

      if (!files || files.length === 0) {
        setError('No files selected');
        setIsDisabled(false);
        return [];
      }

      for (const file of files) {
        const response = await fetch(
          `/api/upload/upload-profile-picture/?userid=${userData.id}&filename=${file.name}`,
          {
            method: 'PUT',
            body: file,
          }
        );

        if (!response.ok) {
          setError('Failed to upload image');
          throw new Error('Failed to upload image');
        }

        const result = await response.json() as PutBlobResult;

        uploadedUrls.push(result.url);
      }

      setError(null);
      setIsDisabled(false);
      return uploadedUrls;
    } catch (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      setIsDisabled(false);
      return [];
    }
  };

  const handleUploadCertificate = async (e: ChangeEvent<HTMLInputElement>, certificateFiles: File[]) => {
    try {
      e.preventDefault();
      setIsDisabled(true);
      setError(null);

      const uploadedUrls: string[] = [];

      if (!certificateFiles || certificateFiles.length === 0) {
        setError('No certificate file selected');
        setIsDisabled(false);
        return [];
      }

      for (const cert of certificateFiles) {
        const response = await fetch(
          `/api/upload/upload-certificate-images/?userid=${userData.id}&filename=${cert.name}`,
          {
            method: 'PUT',
            body: cert,
          }
        );

        if (!response.ok) {
          setError('Failed to upload certificate');
          throw new Error('Failed to upload certificate');
        }

        const result = await response.json() as PutBlobResult;
        uploadedUrls.push(result.url);
      }

      setError(null);
      setIsDisabled(false);
      return uploadedUrls;
    } catch (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      setIsDisabled(false);
      return [];
    }
  };

  const handleRemoveImage = async (imageUrl: string, setCertificates?: React.Dispatch<React.SetStateAction<CertificateForm[]>> | null, setBlobResult?: React.Dispatch<React.SetStateAction<string[]>> | null) => {
    try {
      setIsDisabled(true);
      const response = await fetch(`/api/delete/delete-picture?url=${imageUrl}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Failed to remove image');
        throw new Error('Failed to remove image');
      }

      if (setCertificates) {
        setCertificates(certificates.map(cert => ({
          ...cert,
          images: cert.images.filter(img => img !== imageUrl)
        })));
      } else if (setBlobResult) {
        setBlobResult(blobResult.filter((url) => url !== imageUrl));
      } else {
        setError('No state update function for the removed image');
        setIsDisabled(false);
        return;
      }

      setIsDisabled(false);
      setError(null);
    } catch (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      let message = 'Error removing image';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
    }
  };

  const handleRemoveCertificateImage = (
    imageUrl: string,
    setCertificates: React.Dispatch<React.SetStateAction<CertificateForm[]>>
  ) => {
    handleRemoveImage(imageUrl, setCertificates);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      e.preventDefault();

      setIsDisabled(true);
      setError(null);

      if (!isImageFirst) {
        setError('The first media must be an image. Please rearrange the media files.');
        setIsDisabled(false);
        return;
      }

      const formData = new FormData(e.currentTarget);

      const certificatesPayload = certificates.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        images: cert.images,
        issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString() : null,
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString() : null,
        credentialId: cert.credentialId !== undefined && cert.credentialId !== null && cert.credentialId !== '' ? cert.credentialId : null,
        credentialUrl: cert.credentialUrl || null,
      }));

      const data = {
        name: formData.get('name') as string,
        bio: formData.get('bio') as string,
        fieldOfExpertise: fieldOfExpertise,
        address: formData.get('address') as string,
        displayEmail: formData.get('displayEmail') as string,
        phone: phoneNumbers,
        website: formData.get('website') as string,
        profileImages: blobResult,
        socials: serializeSocials(socials),
        schedule: userData.schedule,
        certificates: certificatesPayload,
      };

      const payload = { ...data, socials: serializeSocials(socials) };
      if (schedule.length > 0) payload.schedule = schedule;

      const res = await fetch('/api/update/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ id: userData.id, data: payload }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setError('Failed to update profile');
        setIsDisabled(false);
        return;
      }

      const result = await res.json();
      setUserData(result.data);
      setError(null);
      setIsDisabled(false);

      redirect.push('/dashboard');
      redirect.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating profile:', error);
      }
    }
  }

  return (
    <>
      {error && <p className="text-red-500 p-2">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className={`w-full ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="tabs tabs-box w-full max-w-full">

          <Divider addClass="mb-4" />

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Name/Bio" defaultChecked />
          <div className="tab-content border-primary p-10">

            <NameSection name={userData.name ?? ""} onChange={val => setUserData({ ...userData, name: val })} />

            <Divider addClass="my-4" />

            <BioSection bio={bio} setBio={setBio} bioRef={bioRef} />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Address/Phone" />
          <div className="tab-content border-primary p-10">

            <AddressSection address={address} setAddress={setAddress} addressRef={addressRef} />

            <Divider addClass="my-4" />

            <PhoneNumbersSection
              phoneNumbers={phoneNumbers}
              setPhoneNumbers={setPhoneNumbers}
              platformIcon={platformIcons['Phone']}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Email/Social Links" />
          <div className="tab-content border-primary p-10">

            <section about="links" className="space-y-4">
              <EmailSection email={displayEmail} setEmail={setDisplayEmail} />

              <Divider addClass="my-4" />

              <WebsiteSection
                website={website}
                setWebsite={setWebsite}
                icon={platformIcons['Website']}
              />

              <Divider addClass="my-4" />

              <SocialsSection
                socials={socials}
                setSocials={setSocials}
                platformIcons={platformIcons}
              />
            </section>
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Image/Video" />
          <div className="tab-content border-primary p-10">

            <ProfileMediaCarousel blobResult={blobResult} />

            <ProfileMediaUpload
              blobResult={blobResult}
              setBlobResult={setBlobResult}
              setError={setError}
              inputFileRef={inputFileRef}
              handleUploadProfileImages={handleUploadProfileImages}
              isDisabled={isDisabled}
            />

            <Divider addClass="my-4" />

            <MediaUrlSection
              blobResult={blobResult}
              setError={setError}
              setBlobResult={setBlobResult}
              handleAddURL={handleAddURL}
            />

            <Divider addClass="my-4" />

            <ProfileMediaList
              blobResult={blobResult}
              setBlobResult={setBlobResult}
              MEDIA_WIDTH={MEDIA_WIDTH}
              MEDIA_HEIGHT={MEDIA_HEIGHT}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Field of Expertise/Certificates" />
          <div className="tab-content border-primary p-10">

            <AreaOfExpertiseSection
              fieldOfExpertise={fieldOfExpertise}
              setFieldOfExpertise={setFieldOfExpertise}
              icon={platformIcons['Expertise']}
            />

            <Divider addClass="my-4" />

            <CertificatesSection
              certificates={certificates}
              setCertificates={setCertificates}
              handleRemoveImage={handleRemoveCertificateImage}
              handleUploadCertificate={handleUploadCertificate}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Schedule" />
          <div className="tab-content border-primary p-10">

            <WorkScheduleSection
              schedule={schedule}
              setSchedule={setSchedule}
              toggleScheduleDay={toggleScheduleDay}
              setScheduleTime={setScheduleTime}
            />

          </div>
        </div >

        <div className="flex-1 flex flex-col w-full mt-4 p-4 border border-primary gap-4">

          <button
            type="submit"
            className="btn btn-success m-4  text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 ease-in-out "
          >
            Save Changes and go to Dashboard
          </button>

        </div>
      </form >

    </>
  );
}
