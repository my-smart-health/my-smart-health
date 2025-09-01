'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";

import GoToButton from "@/components/buttons/go-to/GoToButton";

import { Social } from "@/utils/types";
import { parseSocials, serializeSocials } from "@/utils/common";

import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { AtSign, Facebook, Globe, Instagram, Linkedin, Phone, Youtube } from "lucide-react";


type User = {
  name: string | null;
  address: string | null;
  bio: string | null;
  phone: string[];
  website: string | null;
  displayEmail: string | null;
  image: string | null;
  fieldOfExpertise: string[];
  socials: string[];
  id: string;
}

export default function EditProfileForm({ user }: { user: User }) {

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<User>(user);

  const [fieldOfExpertise, setFieldOfExpertise] = useState<string[]>(user.fieldOfExpertise || []);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(user.phone || []);
  const [socials, setSocials] = useState<Social[]>(parseSocials(user.socials || []));

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      fieldOfExpertise: fieldOfExpertise,
      address: formData.get('address') as string,
      displayEmail: formData.get('displayEmail') as string,
      phone: phoneNumbers,
      website: formData.get('website') as string,
      image: userData.image,
      socials: serializeSocials(socials),
    };
    if (blobResult.length > 0) data.image = blobResult[0];

    if (formData.get('image') && inputFileRef.current?.files?.[0]) {
      try {
        const file = formData.get('image') as File;
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
    try {
      if (userData.image) data.image = userData.image;
      if (blobResult.length > 0) data.image = blobResult[0];

      const payload = { ...data, socials: serializeSocials(socials) };

      const res = await fetch('/api/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ id: userData.id, data: payload }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const result = await res.json();
      setUserData(result.data);

      // redirect.push('/dashboard');
      // redirect.refresh();
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('Error updating profile:', error);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-2xl shadow-xl p-8 flex flex-col border-1 border-primary gap-8"
      >
        {userData.image ? (
          <Image
            loading="lazy"
            src={userData.image}
            alt={userData.name || "Profile image"}
            width={220}
            height={220}
            className="aspect-square w-full border-4 border-primary shadow-lg" />
        ) : (
          <div className="w-full aspect-square skeleton bg-gray-200 flex items-center justify-center mx-auto mt-4 text-gray-400 text-lg font-semibold shadow">
            No Image
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend ">Pick a file</legend>
            <input
              type="file"
              ref={inputFileRef}
              id="image"
              name="image"
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="image" className="label">One image can be selected at a time</label>
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

          <div className="flex flex-col w-full">
            <span className="font-semibold text-gray-700">Socials</span>
            <div className="flex flex-col gap-2 mt-1">
              {socials.map((social, idx) => (
                <div key={idx} className="flex flex-row flex-wrap gap-2 items-center mb-4">
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
                      <span className=" flex items-center justify-center">
                        {platformIcons[social.platform] || null}
                      </span>
                      <select
                        className="select select-ghost"
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
