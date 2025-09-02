'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Suspense, useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";

import GoToButton from "@/components/buttons/go-to/GoToButton";

import { Schedule, Social } from "@/utils/types";
import { parseSocials, serializeSocials } from "@/utils/common";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube, ArrowUpRight } from "lucide-react";
import { MAX_FILES_PER_USER } from "@/utils/constants";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";

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

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<User>(user);

  const [fieldOfExpertise, setFieldOfExpertise] = useState<string[]>(user.fieldOfExpertise || []);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(user.phone || []);
  const [socials, setSocials] = useState<Social[]>(parseSocials(user.socials || []));
  const [schedule, setSchedule] = useState<Schedule[]>(user.schedule || []);

  const [error, setError] = useState<string | null>(null);

  const redirect = useRouter();
  const blobResult: string[] = [];

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let files: File[];

    if (inputFileRef.current && inputFileRef.current.files) {
      files = Array.from(inputFileRef.current.files);
    } else {
      files = [];
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
      profileImages: userData.profileImages,
      socials: serializeSocials(socials),
      schedule: userData.schedule,
    };

    if (blobResult.length > 0) data.profileImages = blobResult;

    if (inputFileRef.current && inputFileRef.current.files) {
      for (const file of files) {
        try {
          const response = await fetch(
            `/api/upload-profile-picture/?userid=${userData.id}&filename=${file.name}`,
            {
              method: 'POST',
              body: file,
            }
          );
          if (!response.ok) throw new Error('Failed to upload image');
          const result = await response.json() as PutBlobResult;
          blobResult.push(result.url);
        } catch (error) {
          process.env.NODE_ENV === 'development' && console.error('Error uploading image:', error);
          return;
        }
      }
    }

    try {
      if (blobResult.length > 0) data.profileImages = blobResult;
      const payload = { ...data, socials: serializeSocials(socials) };
      if (schedule.length > 0) payload.schedule = schedule;
      console.log('Payload to be sent:', payload);
      const res = await fetch('/api/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ id: userData.id, data: payload }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const result = await res.json();
      console.log('Profile updated successfully:', result);
      setUserData(result.data);

      // redirect.push('/dashboard');
      // redirect.refresh();
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('Error updating profile:', error);
    }
  }

  return (
    <>
      {error && <p className="text-red-500 p-2">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-2xl shadow-xl p-8 flex flex-col border-1 border-primary gap-8"
      >
        {userData.profileImages ? (
          <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
            <FadeCarousel photos={userData.profileImages} />
          </Suspense>
        ) : (
          <div className="text-center skeleton min-h-[352px]">No Images</div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend ">Pick a file</legend>
            <input
              type="file"
              ref={inputFileRef}
              name="profileImages"
              accept="image/*"
              multiple
              onChange={e => {
                if (e.target.files && e.target.files.length > MAX_FILES_PER_USER) {
                  setError(`You can select up to ${MAX_FILES_PER_USER} files only.`);
                  e.target.value = "";
                } else {
                  setError(null);
                }
              }}
              className="file-input"
            />
            <label htmlFor="profileImages" className="label">You can upload up to {MAX_FILES_PER_USER} files</label>

          </fieldset>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              defaultValue={userData.name ? userData.name : ""}
              className="mt-1 p-2 rounded border-1 border-primary shadow-sm"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Bio</span>
            <textarea
              name="bio"
              defaultValue={userData.bio ? userData.bio : ""}
              className="mt-1 p-2 rounded border-1 border-primary shadow-sm"
              rows={2}
            />
          </label>

          <div className="w-full mx-auto border border-primary h-0"></div>

          {!userData.address && <span className="font-semibold text-gray-700">Address</span>}
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Address</span>
            <textarea
              name="address"
              defaultValue={userData.address ? userData.address : ""}
              className="mt-1 p-2 rounded border-1 border-primary shadow-sm"
              rows={2}
            />
          </label>

          <div className="w-full mx-auto border border-primary h-0"></div>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Email (Display)</span>
            <input
              type="email"
              name="displayEmail"
              defaultValue={userData.displayEmail ? userData.displayEmail : ""}
              className="mt-1 p-2 rounded border-1 border-primary shadow-sm"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">{platformIcons['Website']}Website</span>
            <input
              type="url"
              name="website"
              defaultValue={userData.website ? userData.website : ""}
              className="mt-1 p-2 rounded border-1 border-primary shadow-sm"
            />
          </label>

          <div className="w-full mx-auto border border-primary h-0"></div>

          {!phoneNumbers.length && <span className="font-semibold text-gray-700">{platformIcons['Phone']} Phone Numbers</span>}
          {phoneNumbers.map((phone, idx) => (
            <div className="flex flex-row flex-1 gap-2 items-center " key={idx}>
              <div className="flex flex-col flex-1 ">
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
                    className="mt-1 p-2 flex-1 rounded border-1 align-baseline border-primary shadow-sm"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    phoneNumbers.splice(idx, 1);
                    setPhoneNumbers([...phoneNumbers]);
                  }}
                  className="flex place-self-end mt-4  w-fit align-bottom text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPhoneNumbers([...phoneNumbers, ""])}
            className="mt-2 px-3 py-1 bg-primary text-white rounded"
          >
            Add Phone Number
          </button>

          <div className="w-full mx-auto border border-primary h-0"></div>

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
                    className="mt-1 p-2 flex-1 rounded border-1 align-baseline border-primary shadow-sm"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    fieldOfExpertise.splice(idx, 1);
                    setFieldOfExpertise([...fieldOfExpertise]);
                  }}
                  className="flex place-self-end mt-4  w-fit align-bottom text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFieldOfExpertise([...fieldOfExpertise, ""])}
            className="mt-2 px-3 py-1 bg-primary text-white rounded"
          >
            Add Area of Expertise
          </button>

          <div className="w-full mx-auto border border-primary h-0"></div>

          <div className="flex flex-col w-full max-w-[99.9%]">
            <span className="font-semibold text-gray-700">Socials</span>
            <div className="flex flex-col gap-2 mt-1">
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
                    className="flex-1 rounded border-1 border-primary shadow-sm p-2"
                  />
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2">
                      <span className=" flex items-center justify-center  max-w-[40px]">
                        {platformIcons[social.platform] || null}
                      </span>
                      <select
                        className="select select-ghost"
                        name={`socials[${idx}].platform`}
                        value={social.platform}
                        onChange={e => {
                          const updated = [...socials];
                          updated[idx].platform = e.target.value;
                          setSocials(updated);
                        }}
                      >
                        <option disabled value="">Pick a platform</option>
                        <option value="Email">Email</option>
                        <option value="Website">Website</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Linkedin">Linkedin</option>
                        <option value="X">X.com</option>
                        <option value="Youtube">Youtube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSocials(socials.filter((_, i) => i !== idx))}
                      className="text-red-500 self-end"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSocials([...socials, { platform: '', url: '' }])}
              className="mt-2 px-3 py-1 bg-primary text-white rounded"
            >
              Add Social Link
            </button>
          </div>

          <div className="w-full mx-auto border border-primary h-0"></div>

          {
            schedule.map((item, idx) => (
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
                      className="checkbox"
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
                      className="checkbox"
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
                      className="checkbox"
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
                      className="checkbox"
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
                      className="checkbox"
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
                      className="checkbox"
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
                      className="checkbox"
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
                        className="border border-primary p-2 rounded"
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
                        className="border border-primary p-2 rounded"
                        onChange={(e) => setScheduleTime(item.id, 'close', e.target.value)}
                      />
                      <span className="text-xs text-gray-500 w-fit flex flex-nowrap">click here to set <ArrowUpRight /></span>
                    </div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))}
                  className="text-red-500 self-end"
                >
                  Remove
                </button>
              </fieldset>

            ))
          }
          <button
            type="button"
            onClick={() => setSchedule([...schedule, { id: crypto.randomUUID(), day: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false }, open: '', close: '' }])}
            className="mt-2 px-3 py-1 bg-primary text-white rounded"
          >
            Add Schedule
          </button>


          <div className="w-full mx-auto border border-primary h-0"></div>

          <button
            type="submit"
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Save Changes
          </button>
        </div>
      </form >
      <GoToButton src="/dashboard" name="Back to Dashboard" />
    </>
  );
}
