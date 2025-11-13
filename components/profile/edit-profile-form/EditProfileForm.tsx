'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { MouseEvent, useEffect, useRef, useState, ChangeEvent } from "react";

import { Certificate, CertificateForm, FieldOfExpertise, Location, ReservationLink, Schedule, Social } from "@/utils/types";
import { isInstagramLink, isYoutubeLink, parseSocials } from "@/utils/common";
import { buildSanitizedPayload, ProfileUpdatePayload } from "./formSanitizers";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, SaveAll, Youtube } from "lucide-react";

import Divider from "@/components/divider/Divider";
import { MAX_IMAGE_SIZE_MB, MAX_IMAGE_SIZE_BYTES } from "@/utils/constants";
import {
  NameSection,
  BioSection,
  EmailSection,
  WebsiteSection,
  SocialsSection,
  ProfileMediaCarousel,
  ProfileMediaUpload,
  ProfileMediaList,
  MediaUrlSection,
  AreaOfExpertiseSection,
  CertificatesSection,
  WorkScheduleSection,
  PhoneNumbersSection,
  LocationSection,
  ReservationLinksSection
} from "./_components";

type User = {
  id: string;
  socials: string[];
  bio: string | null;
  name: string | null;
  profileImages: string[] | null;
  website: string | null;
  fieldOfExpertise: FieldOfExpertise[] | null;
  displayEmail: string | null;
  phones: string[];
  reservationLinks: ReservationLink[] | null;
  schedule: Schedule[] | null;
  certificates: Certificate[] | null;
  locations: Location[];
};

export default function EditProfileForm({ user }: { user: User }) {

  const MEDIA_WIDTH = 200;
  const MEDIA_HEIGHT = 200;

  const redirect = useRouter();

  const bioRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const errorModalRef = useRef<HTMLDialogElement>(null);

  const [bio, setBio] = useState(user.bio || "");
  const [name, setName] = useState(user.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [phones, setPhones] = useState(user.phones || []);
  const [website, setWebsite] = useState(user.website || "");
  const [schedule, setSchedule] = useState<Schedule[]>(user.schedule || []);
  const [displayEmail, setDisplayEmail] = useState(user.displayEmail || "");
  const [locations, setLocations] = useState<Location[]>(user.locations || []);
  const [blobResult, setBlobResult] = useState<string[]>(user.profileImages || []);
  const [socials, setSocials] = useState<Social[]>(parseSocials(user.socials || []));
  const [fieldOfExpertise, setFieldOfExpertise] = useState<FieldOfExpertise[]>(user.fieldOfExpertise || []);
  const [certificates, setCertificates] = useState<CertificateForm[]>(user.certificates?.map(cert => ({ ...cert })) || []);
  const [reservationLinks, setReservationLinks] = useState<ReservationLink[]>(user.reservationLinks || []);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  const handleUpdateProfileImagesInDB = async (updatedImages: string[]) => {
    try {
      const payload = buildSanitizedPayload({
        name,
        bio,
        displayEmail,
        website,
        profileImages: blobResult,
        fieldOfExpertise,
        phones,
        socials,
        schedule,
        certificates,
        reservationLinks,
        locations,
        profileImagesOverride: updatedImages,
      });

      const response = await fetch('/api/update/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          data: payload,
        }),
      });

      if (!response.ok) {
        setError('Failed to auto-save profile images. Your changes may not be saved.');
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to auto-save profile images to database');
        }
      }
    } catch (error) {
      setError('Error saving profile images. Please try again or contact support.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error auto-saving profile images:', error);
      }
    }
  };

  const platformIcons: Record<string, React.ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={20} />,
    Website: <Globe className="inline-block mr-1" size={20} />,
    Phone: <Phone className="inline-block mr-1" size={20} />,
    Facebook: <Facebook className="inline-block mr-1" size={20} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={20} />,
    X: <Image src={Xlogo} width={16} height={16} alt="X.com" loading="lazy" placeholder="empty" style={{ objectFit: "contain", width: "auto", height: "auto" }} className="mr-2" />,
    Youtube: <Youtube className="inline-block mr-1" size={20} />,
    TikTok: <Image src={TikTokLogo} width={20} height={20} alt="TikTok" loading="lazy" placeholder="empty" style={{ objectFit: "contain", width: "auto", height: "auto" }} className="-m-1" />,
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
    resize(addressRef.current, Array.isArray(locations) ? locations.join('\n') : locations);
  }, [bio, locations]);

  useEffect(() => {
    if (error) {
      errorModalRef.current?.showModal();
    }
  }, [error]);

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

      for (const file of Array.from(files)) {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setError(`Image "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`);
          setIsDisabled(false);
          return [];
        }
      }

      for (const file of files) {
        const response = await fetch(
          `/api/upload/upload-profile-picture/?userid=${user.id}&filename=${file.name}`,
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
        if (cert.size > MAX_IMAGE_SIZE_BYTES) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setError(`Certificate image "${cert.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`);
          setIsDisabled(false);
          return [];
        }
      }

      for (const cert of certificateFiles) {
        const response = await fetch(
          `/api/upload/upload-certificate-images/?userid=${user.id}&filename=${cert.name}`,
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

      if (!isYoutubeLink(imageUrl) && !isInstagramLink(imageUrl)) {
        const response = await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          setError('Failed to remove image');
          throw new Error('Failed to remove image');
        }
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

  const handleRemoveCertificateImage = async (
    imageUrl: string,
    setCertificates: React.Dispatch<React.SetStateAction<CertificateForm[]>>
  ) => {
    await handleRemoveImage(imageUrl, setCertificates);
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

      const payload: ProfileUpdatePayload = buildSanitizedPayload({
        name,
        bio,
        displayEmail,
        website,
        profileImages: blobResult,
        fieldOfExpertise,
        phones,
        socials,
        schedule,
        certificates,
        reservationLinks,
        locations,
      });

      const res = await fetch('/api/update/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ id: user.id, data: payload }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setError('Failed to update profile');
        setIsDisabled(false);
        return;
      }

      setError(null);
      setIsDisabled(false);

      redirect.push(`/profile/${user.id}`);
      redirect.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating profile:', error);
      }
    }
  }

  const handleErrorClose = () => {
    setError(null);
    errorModalRef.current?.close();
  };

  return (
    <>
      {error && (
        <dialog
          ref={errorModalRef}
          id="edit_profile_error_modal"
          className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
          style={{ backgroundColor: 'transparent' }}
          onClose={handleErrorClose}
        >
          <div
            className="modal-box bg-red-500 text-white rounded-2xl w-[95%]"
            style={{
              width: "80vw",
              maxWidth: "80vw",
              margin: '2rem auto',
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              minHeight: "unset",
              padding: "2rem 1.5rem"
            }}
          >
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
                onClick={handleErrorClose}
                type="button"
              >✕</button>
            </form>
            <h3 className="font-bold text-lg">Fehler</h3>
            <p className="py-4 text-center">{error}</p>
          </div>
        </dialog>
      )}

      <form
        onSubmit={handleSubmit}
        className={`w-full ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Divider addClass="mb-4" />

        <div className="tabs tabs-lift m-2 w-full mx-auto max-w-[96%]">

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Name/Expertise" defaultChecked />
          <div className="tab-content border-primary p-3 md:p-10">

            <NameSection name={name} onChange={setName} />

            <Divider addClass="my-4" />

            <AreaOfExpertiseSection
              fieldOfExpertise={fieldOfExpertise}
              setFieldOfExpertise={setFieldOfExpertise}
              icon={platformIcons['Expertise']}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Bio" />
          <div className="tab-content border-primary p-3 md:p-10">

            <BioSection bio={bio} setBio={setBio} />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Address" />
          <div className="tab-content border-primary p-3 md:p-10">

            <LocationSection locations={locations} setLocationsAction={setLocations} profileId={user.id} addressRef={addressRef} />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Phone/Email" />
          <div className="tab-content border-primary p-3 md:p-10">

            <section about="links" className="space-y-4">
              <PhoneNumbersSection phoneNumbers={phones} setPhoneNumbers={setPhones} platformIcon={platformIcons['Phone']} />

              <Divider addClass="my-4" />

              <EmailSection email={displayEmail} setEmail={setDisplayEmail} />

              <Divider addClass="my-4" />

              <WebsiteSection
                website={website}
                setWebsite={setWebsite}
                icon={platformIcons['Website']}
              />
            </section>
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Additional Social Links" />
          <div className="tab-content border-primary p-3 md:p-10">

            <section about="links" className="space-y-4">

              <SocialsSection
                socials={socials}
                setSocials={setSocials}
                platformIcons={platformIcons}
              />
            </section>
          </div>


          <input type="radio" name="my_tabs_2" className="tab" aria-label="Image/Video" />
          <div className="tab-content border-primary p-3 md:p-10">

            <ProfileMediaCarousel blobResult={blobResult} />

            <ProfileMediaUpload
              blobResult={blobResult}
              setBlobResult={setBlobResult}
              setError={setError}
              inputFileRef={inputFileRef}
              handleUploadProfileImages={handleUploadProfileImages}
              isDisabled={isDisabled}
              onAfterUpload={handleUpdateProfileImagesInDB}
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
              onAfterDelete={handleUpdateProfileImagesInDB}
              onAfterMove={handleUpdateProfileImagesInDB}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Certificates" />
          <div className="tab-content border-primary p-3 md:p-10">

            <CertificatesSection
              certificates={certificates}
              setCertificates={setCertificates}
              handleRemoveImage={handleRemoveCertificateImage}
              handleUploadCertificate={handleUploadCertificate}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Global Schedule" />
          <div className="tab-content border-primary p-3 md:p-10">

            <WorkScheduleSection
              schedule={schedule}
              setSchedule={setSchedule}
              toggleScheduleDay={toggleScheduleDay}
              setScheduleTime={setScheduleTime}
            />

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Reservierungen/Termine" />
          <div className="tab-content border-primary p-3 md:p-10">

            <ReservationLinksSection
              reservationLinks={reservationLinks}
              onChange={setReservationLinks}
            />

          </div>
        </div >

        <div className="flex-1 flex flex-col w-full mt-4 p-4 border border-primary gap-4">

          <button
            type="submit"
            className="btn btn-success m-4  text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 ease-in-out "
          >
            <SaveAll />  Save Changes and go to Dashboard
          </button>

        </div>
      </form >

    </>
  );
}
