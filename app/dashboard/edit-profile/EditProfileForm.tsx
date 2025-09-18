'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { MouseEvent, Suspense, useEffect, useRef, useState, ChangeEvent } from "react";
import { PutBlobResult } from "@vercel/blob";

import GoToButton from "@/components/buttons/go-to/GoToButton";

import { Certificate, CertificateForm, Schedule, Social } from "@/utils/types";
import { parseSocials, serializeSocials } from "@/utils/common";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube, ArrowUpRight } from "lucide-react";
import { MAX_FILES_PER_USER } from "@/utils/constants";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import Divider from "@/components/divider/Divider";

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
            <section>
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">Name</span>
                <input
                  type="text"
                  name="name"
                  defaultValue={userData.name ? userData.name : ""}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </label>
            </section>

            <Divider addClass="my-4" />

            <section>
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">Bio</span>
                <textarea
                  name="bio"
                  ref={bioRef}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
                  rows={1}
                />
              </label>
            </section>
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Address/Phone" />
          <div className="tab-content border-primary p-10">

            <section>
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">Address</span>
                <textarea
                  name="address"
                  ref={addressRef}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
                  rows={1}
                />
              </label>
            </section>

            <Divider addClass="my-4" />

            <section className="space-y-4">
              {!phoneNumbers.length && <span className="font-semibold text-gray-700">{platformIcons['Phone']} Phone Numbers</span>}
              {phoneNumbers.map((phone, idx) => (
                <div className="flex flex-row flex-1 gap-2 items-center " key={idx}>
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="font-semibold text-gray-700">{platformIcons['Phone']} Phone Number</span>
                    <label htmlFor={`phone[${idx}]`} className="flex flex-row gap-2">
                      <input
                        type="text"
                        name={`phone[${idx}]`}
                        value={phone}
                        onChange={e => {
                          const updated = [...phoneNumbers];
                          updated[idx] = e.target.value;
                          setPhoneNumbers(updated);
                        }}
                        className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        phoneNumbers.splice(idx, 1);
                        setPhoneNumbers([...phoneNumbers]);
                      }}
                      className="btn btn-outline flex place-self-end mt-4  w-fit align-bottom text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Divider addClass="my-4" />

              <button
                type="button"
                onClick={() => setPhoneNumbers([...phoneNumbers, ""])}
                className="btn btn-outline btn-primary px-3 py-1 w-full"
              >
                Add Phone Number
              </button>
            </section>
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Email/Social Links" />
          <div className="tab-content border-primary p-10">

            <section about="links" className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">Email (Display)</span>
                <input
                  type="email"
                  name="displayEmail"
                  defaultValue={userData.displayEmail ? userData.displayEmail : ""}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">{platformIcons['Website']}Website</span>
                <input
                  type="url"
                  name="website"
                  defaultValue={userData.website ? userData.website : ""}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </label>

              <Divider addClass="my-4" />

              <div className="flex flex-col gap-2 mt-1">
                <span className="font-semibold text-gray-700">Socials</span>
                {socials.map((social, idx) => (
                  <div key={idx} className="flex flex-row flex-wrap gap-4 items-center mb-4">
                    <input
                      type="text"
                      placeholder="URL"
                      value={social.url}
                      onChange={e => {
                        const updated = [...socials];
                        updated[idx].url = e.target.value;
                        setSocials(updated);
                      }}
                      className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-[200px]"
                    />
                    <div className="flex flex-col w-full gap-2">
                      <div className="flex items-center gap-2">
                        <span className=" flex items-center justify-center  max-w-[40px]">
                          {platformIcons[social.platform] || null}
                        </span>
                        <select
                          className="select select-bordered select-primary w-full max-w-xs border-primary"
                          name={`socials[${idx}].platform`}
                          value={social.platform}
                          onChange={e => {
                            const updated = [...socials];
                            updated[idx].platform = e.target.value;
                            setSocials(updated);
                          }}
                        >
                          <option disabled value="">Pick a platform</option>
                          <option className="select-option" value="Email">Email</option>
                          <option className="select-option" value="Website">Website</option>
                          <option className="select-option" value="Facebook">Facebook</option>
                          <option className="select-option" value="Linkedin">Linkedin</option>
                          <option className="select-option" value="X">X.com</option>
                          <option className="select-option" value="Youtube">Youtube</option>
                          <option className="select-option" value="TikTok">TikTok</option>
                          <option className="select-option" value="Instagram">Instagram</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSocials(socials.filter((_, i) => i !== idx))}
                        className="btn btn-outline text-red-500 self-end"
                      >
                        Remove
                      </button>

                    </div>
                  </div>
                ))}
              </div>

              <Divider addClass="my-4" />

              <button
                type="button"
                onClick={() => setSocials([...socials, { platform: '', url: '' }])}
                className="btn btn-outline btn-primary px-3 py-1 w-full rounded"
              >
                Add Social Link
              </button>

            </section>

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Image/Video" />
          <div className="tab-content border-primary p-10">

            <section>
              <div className="flex flex-col justify-center items-center content-center max-w-full">
                {blobResult && blobResult.length > 0 ? (
                  <div className="max-w-full">
                    <Suspense fallback={<div className={`text-center skeleton min-h-[${MAX_FILES_PER_USER}]`}>Loading...</div>}>
                      <FadeCarousel photos={blobResult} />
                    </Suspense>
                  </div>
                ) : (
                  <div className="text-center skeleton min-h-[352px]">No Images</div>
                )}
              </div>
            </section>

            <section>
              <fieldset className={`fieldset mb-5 ${blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}`}>
                <legend className="fieldset-legend">Select File</legend>
                <div className="flex flex-wrap gap-4 w-full">
                  <input
                    type="file"
                    ref={inputFileRef}
                    id="image"
                    name="image"
                    accept="image/*"
                    multiple={true}
                    className={`${blobResult && blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''} file-input file-input-bordered file-input-primary w-full`}
                    onChange={async e => {
                      const files = e.target.files;
                      if (!files) return;
                      if (blobResult.length + files.length > MAX_FILES_PER_USER) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setError(`You can select up to ${MAX_FILES_PER_USER} files only.`);
                        e.target.value = "";
                        return;
                      }
                      const uploadedImages = await handleUploadProfileImages(files);
                      setBlobResult(prev => [...prev, ...uploadedImages]);
                      setError(null);
                    }} />
                </div>
              </fieldset>
            </section>

            <Divider addClass="my-4" />

            <section>
              <fieldset className={blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}>
                <legend className="fieldset-legend">Add Media URL</legend>
                <div className="flex flex-col gap-4 w-full">
                  <label htmlFor={`media`} className="">Media URL must be a valid URL from YouTube or Instagram</label>
                  <input
                    type="text"
                    name={`media`}
                    placeholder="https://"
                    className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddURL(e)
                    }}
                    className="btn btn-outline btn-primary w-full mt-2"
                  >
                    Upload Media URL
                  </button>

                  <Divider addClass="my-2" />

                  <div className="flex flex-wrap max-w-[50%] gap-4 text-wrap mx-auto">
                    {blobResult && blobResult.length > 0 && (
                      <>
                        <div className="text-sm">You can add up to {MAX_FILES_PER_USER} media files (images, Instagram videos, or YouTube videos)</div>
                        <p className="text-wrap text-warning">NB: Please ensure that the first media is image.</p>
                      </>
                    )}
                  </div>
                </div>
              </fieldset>
            </section>

            <Divider addClass="my-4" />

            <section>
              <div className="flex flex-col items-center gap-8 w-full max-w-full">
                {blobResult.map((mediaUrl, idx) => {
                  const isYoutube = /youtu(be)?/.test(mediaUrl);
                  const isInstagram = /instagram/.test(mediaUrl);

                  const media = (
                    <div
                      className={
                        isYoutube
                          ? "aspect-video flex items-center justify-center rounded-lg overflow-hidden"
                          : "aspect-square flex items-center justify-center rounded-lg overflow-hidden max-w-[200px]"
                      }
                    >
                      {isYoutube ? (
                        <YoutubeEmbed embedHtml={mediaUrl} width={200} height={112} />
                      ) : isInstagram ? (
                        <InstagramEmbed embedHtml={mediaUrl} width={MEDIA_WIDTH} height={MEDIA_HEIGHT} />
                      ) : (
                        <div className="relative w-[200px] h-[200px]">
                          <Image
                            src={mediaUrl}
                            alt={`Photo ${idx + 1}`}
                            fill
                            sizes="(max-width: 600px) 100vw, 200px"
                            style={{ objectFit: "contain" }}
                            className="rounded-lg border border-primary hover:scale-150 transition-transform duration-300 ease-in-out"
                          />
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <div
                      key={mediaUrl + idx}
                      className="flex flex-row items-center justify-center gap-6 w-full"
                    >
                      {media}
                      <div className="flex flex-col items-center gap-2">
                        <MoveImageVideo
                          index={idx}
                          blobResult={blobResult}
                          setBlobResultAction={setBlobResult}
                          showTop={idx > 0}
                          showBottom={idx < blobResult.length - 1}
                          removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(mediaUrl)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <Divider addClass="my-4" />
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Field of Expertise/Certificates" />
          <div className="tab-content border-primary p-10">

            <section>
              {!fieldOfExpertise.length && <span className="font-semibold text-gray-700">Area of Expertise</span>}
              {fieldOfExpertise.map((expertise, idx) => (
                <div className="flex flex-row flex-1 gap-2 items-center " key={idx}>
                  <div className="flex flex-col flex-1 ">
                    <span className="font-semibold text-gray-700">{platformIcons['Expertise']} Area of Expertise</span>
                    <label htmlFor={`expertise[${idx}]`} className="flex flex-row gap-2">
                      <input
                        type="text"
                        name={`expertise[${idx}]`}
                        value={expertise}
                        onChange={e => {
                          const updated = [...fieldOfExpertise];
                          updated[idx] = e.target.value;
                          setFieldOfExpertise(updated);
                        }}
                        className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        fieldOfExpertise.splice(idx, 1);
                        setFieldOfExpertise([...fieldOfExpertise]);
                      }}
                      className="btn btn-outline flex place-self-end mt-4  w-fit align-bottom text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Divider addClass="my-4" />

              <button
                type="button"
                onClick={() => setFieldOfExpertise([...fieldOfExpertise, ""])}
                className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
              >
                + Area of Expertise
              </button>
            </section>

            <Divider addClass="my-4" />

            <section>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Certificates</legend>
                <div className="flex flex-col gap-4 w-full">
                  {certificates.map((cert, idx) => (
                    <div key={cert.id || idx} className="flex flex-col gap-4 border border-primary rounded p-4 relative">
                      <button
                        type="button"
                        onClick={() => {
                          cert.images.forEach(imageURL => handleRemoveImage(imageURL, setCertificates));
                          setCertificates(certificates.filter((_, i) => i !== idx));
                        }}
                        className="relative top-2 right-2 self-end btn btn-circle btn-error hover:bg-red-600/70 text-white font-bold text-lg"
                        aria-label="Remove certificate"
                        title="Remove certificate"
                      >
                        &times;
                      </button>
                      <div className="flex flex-col gap-2">
                        <label className="flex flex-col gap-2">
                          <span className="font-semibold text-gray-700">Certificate Name</span>
                          <input
                            type="text"
                            name={`certificates[${idx}].name`}
                            value={cert.name}
                            required
                            placeholder="e.g. Certificate for ..."
                            onChange={e => {
                              const updated = [...certificates];
                              updated[idx].name = e.target.value;
                              setCertificates(updated);
                            }}
                            className="required: p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="font-semibold text-gray-700">Issuer</span>
                          <input
                            type="text"
                            name={`certificates[${idx}].issuer`}
                            value={cert.issuer}
                            required
                            placeholder="e.g. Issued by ..."
                            onChange={e => {
                              const updated = [...certificates];
                              updated[idx].issuer = e.target.value;
                              setCertificates(updated);
                            }}
                            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          />
                        </label>
                        <div className="flex flex-col gap-4">
                          <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold text-gray-700">Issue Date</span>
                            <input
                              type="date"
                              name={`certificates[${idx}].issueDate`}
                              value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ""}
                              required
                              onChange={e => {
                                const updated = [...certificates];
                                updated[idx].issueDate = e.target.value ? new Date(e.target.value) : new Date();
                                setCertificates(updated);
                              }}
                              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-fit"
                            />
                          </label>
                          <label className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2 font-semibold text-gray-700">
                              <span>Expiry Date</span>
                              <input
                                type="checkbox"
                                checked={!!cert.expiryDate}
                                onChange={e => {
                                  const updated = [...certificates];
                                  if (e.target.checked) {
                                    updated[idx].expiryDate = new Date();
                                  } else {
                                    updated[idx].expiryDate = null;
                                  }
                                  setCertificates(updated);
                                }}
                                className="checkbox checkbox-primary m-0 p-1"
                              />
                              <span className="text-xs font-normal text-gray-500">Enable</span>
                            </div>
                            {cert.expiryDate && (
                              <input
                                type="date"
                                name={`certificates[${idx}].expiryDate`}
                                value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ""}
                                onChange={e => {
                                  const updated = [...certificates];
                                  updated[idx].expiryDate = e.target.value ? new Date(e.target.value) : null;
                                  setCertificates(updated);
                                }}
                                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-fit"
                              />
                            )}
                          </label>
                        </div>
                        <label className="flex flex-col gap-2">
                          <div className="flex flex-row items-center gap-2 font-semibold text-gray-700">
                            <span>Credential ID</span>
                            <input
                              type="checkbox"
                              checked={cert.credentialId !== null && cert.credentialId !== undefined}
                              onChange={e => {
                                const updated = [...certificates];
                                if (e.target.checked) {
                                  updated[idx].credentialId = '';
                                } else {
                                  updated[idx].credentialId = null;
                                }
                                setCertificates(updated);
                              }}
                              className="checkbox checkbox-primary m-0 p-1"
                            />
                            <span className="text-xs font-normal text-gray-500">Enable</span>
                          </div>
                          {(cert.credentialId !== null && cert.credentialId !== undefined) && (
                            <input
                              type="text"
                              name={`certificates[${idx}].credentialId`}
                              value={cert.credentialId}
                              placeholder="e.g. 123-ABC-456"
                              onChange={e => {
                                const updated = [...certificates];
                                updated[idx].credentialId = e.target.value;
                                setCertificates(updated);
                              }}
                              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            />
                          )}
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="font-semibold text-gray-700">Credential URL</span>
                          <input
                            type="url"
                            name={`certificates[${idx}].credentialUrl`}
                            value={cert.credentialUrl || ''}
                            onChange={e => {
                              const updated = [...certificates];
                              updated[idx].credentialUrl = e.target.value || null;
                              setCertificates(updated);
                            }}
                            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          />
                        </label>

                        <div className="flex flex-col gap-2">
                          <span className="font-semibold text-gray-700">Certificate Images</span>
                          <div className="flex flex-col gap-4">
                            {cert.images && cert.images.length > 0 ? (
                              cert.images.map((imgUrl, imgIdx) => (
                                <div key={imgUrl + imgIdx} className="flex items-center gap-4">
                                  <div className="relative w-[100px] h-[100px]">
                                    <Image
                                      src={imgUrl}
                                      alt={`Certificate ${idx + 1} Image ${imgIdx + 1}`}
                                      fill
                                      sizes="100px"
                                      className="rounded border border-primary object-contain"
                                    />
                                  </div>
                                  <MoveImageVideo
                                    index={imgIdx}
                                    blobResult={cert.images}
                                    setBlobResultAction={newArr => {
                                      const updated = [...certificates];
                                      updated[idx].images = newArr;
                                      setCertificates(updated);
                                    }}
                                    showTop={imgIdx > 0}
                                    showBottom={imgIdx < cert.images.length - 1}
                                    removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(imgUrl)}`}
                                  />
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">No images attached</span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="file-input file-input-bordered file-input-primary w-full mt-2"
                            onChange={async e => {
                              if (!e.target.files) return;
                              const uploaded = await handleUploadCertificate(e, Array.from(e.target.files));
                              if (uploaded.length) {
                                const updated = [...certificates];
                                updated[idx].images = [...(updated[idx].images || []), ...uploaded];
                                setCertificates(updated);
                              }
                              e.target.value = "";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Divider addClass="my-4" />
                <button
                  type="button"
                  onClick={() => setCertificates([
                    ...certificates,
                    {
                      name: '',
                      issuer: '',
                      images: [],
                      issueDate: new Date(),
                      expiryDate: null,
                      credentialId: null,
                      credentialUrl: null,
                    }
                  ])}
                  className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
                >
                  + Add Certificate
                </button>
                <Divider addClass="my-4" />
              </fieldset>
            </section>

          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Schedule" />
          <div className="tab-content border-primary p-10">

            <section>
              {schedule.map((item, idx) => (
                <fieldset
                  key={item.id}
                  className="fieldset grid-cols-2 max-w-[99.9%]">
                  <legend className="fieldset-legend ">Work Schedule</legend>
                  <div className="grid grid-cols-1 w-full max-w-[99.9%] gap-2">
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-monday"
                        value="Monday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Monday}
                        onChange={() => toggleScheduleDay(item.id, 'Monday')}
                      />
                      Montag
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-tuesday"
                        value="Tuesday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Tuesday}
                        onChange={() => toggleScheduleDay(item.id, 'Tuesday')}
                      />
                      Dienstag
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-wednesday"
                        value="Wednesday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Wednesday}
                        onChange={() => toggleScheduleDay(item.id, 'Wednesday')}
                      />
                      Mittwoch
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-thursday"
                        value="Thursday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Thursday}
                        onChange={() => toggleScheduleDay(item.id, 'Thursday')}
                      />
                      Donnerstag
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-friday"
                        value="Friday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Friday}
                        onChange={() => toggleScheduleDay(item.id, 'Friday')}
                      />
                      Freitag
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-saturday"
                        value="Saturday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Saturday}
                        onChange={() => toggleScheduleDay(item.id, 'Saturday')}
                      />
                      Samstag
                    </label>
                    <label htmlFor="schedule" className="label">
                      <input
                        type="checkbox"
                        name="schedule-sunday"
                        value="Sunday"
                        className="checkbox checkbox-primary"
                        checked={item.day.Sunday}
                        onChange={() => toggleScheduleDay(item.id, 'Sunday')}
                      />
                      Sonntag
                    </label>
                  </div>
                  <div className="grid grid-rows-2 gap-3 justify-baseline mt-4 w-full max-w-[99.9%]">
                    <label htmlFor="time" className="label text-center flex-col">
                      <span className="label-text">Time start</span>
                      <div className="flex flex-col">
                        <input
                          type="time"
                          id="time"
                          name="time-start"
                          value={item.open}
                          className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          onChange={(e) => setScheduleTime(item.id, 'open', e.target.value)}
                        />
                        <span className="text-xs text-gray-500 w-fit flex flex-nowrap">click here to set <ArrowUpRight /></span>
                      </div>
                    </label>
                    <label htmlFor="time-end" className="label text-center flex-col">
                      <span className="label-text">Time end</span>
                      <div className="flex flex-col">
                        <input
                          type="time"
                          id="time-end"
                          name="time-end"
                          value={item.close}
                          style={{ textTransform: 'none' }}
                          className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          onChange={(e) => setScheduleTime(item.id, 'close', e.target.value)}
                        />
                        <span className="text-xs text-gray-500 w-fit flex flex-nowrap">click here to set <ArrowUpRight /></span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))}
                      className="btn btn-outline w-full text-red-500 self-end"
                    >
                      Remove
                    </button>
                  </div>
                  <Divider addClass="my-4 col-span-2" />
                </fieldset>
              ))}
              <button
                type="button"
                onClick={() => setSchedule([...schedule, {
                  id: crypto.randomUUID(),
                  day:
                  {
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
                }])}
                className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
              >
                Add Schedule
              </button>
            </section>

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
