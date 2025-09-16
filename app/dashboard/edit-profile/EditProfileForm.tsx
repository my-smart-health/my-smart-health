'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { MouseEvent, Suspense, useEffect, useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";

import GoToButton from "@/components/buttons/go-to/GoToButton";

import { Schedule, Social } from "@/utils/types";
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
}

export default function EditProfileForm({ user }: { user: User }) {

  const MEDIA_WIDTH = 200;
  const MEDIA_HEIGHT = 200;
  const inputFileRef = useRef<HTMLInputElement>(null);

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

  const redirect = useRouter();

  const [blobResult, setBlobResult] = useState<string[]>(userData.profileImages || []);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  useEffect(() => {
    if (blobResult.length > 0) {
      setIsImageFirst(
        blobResult[0].search("instagram") === -1 &&
        blobResult[0].search("youtube") === -1 &&
        blobResult[0].search("youtu") === -1
      );
    }
  }, [blobResult]);

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

  const toggleScheduleDay = (id: string, day: keyof Schedule['day']) => {
    setSchedule(schedule.map(schedule => schedule.id === id ? { ...schedule, day: { ...schedule.day, [day]: !schedule.day[day] } } : schedule));
  };

  const setScheduleTime = (id: string, openClose: keyof Schedule, value: string) => {
    setSchedule(schedule.map(schedule => schedule.id === id ? { ...schedule, [openClose]: value.toString() } : schedule));
  };

  const handleImageUpload = async (files: FileList) => {
    try {
      setIsDisabled(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {

        const response = await fetch(
          `/api/upload-profile-picture/?userid=${userData.id}&filename=${file.name}`,
          {
            method: 'PUT',
            body: file,
          }
        );

        const result = await response.json() as PutBlobResult;

        if (!response.ok) {
          setError('Failed to upload image');
          throw new Error('Failed to upload image');
        }

        uploadedUrls.push(result.url);
      }
      setIsDisabled(false);
      setError(null);
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
      };

      const payload = { ...data, socials: serializeSocials(socials) };
      if (schedule.length > 0) payload.schedule = schedule;

      const res = await fetch('/api/update-profile', {
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
      {error && <p className="text-red-500 p-2">{error}</p>
      }
      <form
        onSubmit={handleSubmit}
        className={`w-full ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="tabs tabs-box w-full max-w-full">

          <Divider addClass="my-4" />

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
                  defaultValue={userData.bio ? userData.bio : ""}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  rows={5}
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
                  defaultValue={userData.address ? userData.address : ""}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  placeholder="Deutschland, Düsseldorf, Kölner Straße 123"
                  rows={5}
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
                      const uploadedImages = await handleImageUpload(files);
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
                          removeAddress={`/api/delete-picture?url=${encodeURIComponent(mediaUrl)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <Divider addClass="my-4" />
          </div>

          <input type="radio" name="my_tabs_2" className="tab" aria-label="Field of Expertise/Schedule" />
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
                className="btn w-full btn-outline mt-2 px-3 py-1"
              >
                + Area of Expertise
              </button>
            </section>

            <Divider addClass="my-4" />

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
                className="btn btn-outline btn-primary mt-2 px-3 py-1 rounded"
              >
                Add Schedule
              </button>
            </section>

          </div>
        </div >

        <div className="flex-1 flex flex-col w-full mt-4 p-4 border border-primary gap-4">
          <GoToButton src="/dashboard" name="Back to Dashboard" className="btn btn-outline btn-primary" />

          <Divider addClass="my-4" />

          <button
            type="submit"
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Save Changes
          </button>

        </div>
      </form >

    </>
  );
}
