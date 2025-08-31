'use client'

import GoToButton from "@/components/buttons/go-to/GoToButton";
import { PutBlobResult } from "@vercel/blob";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type User = {
  name: string | null;
  address: string | null;
  bio: string | null;
  phone: string[];
  website: string | null;
  image: string | null;
  fieldOfExpertise: string[];
  socials: {
    userId: string;
    id: string;
    url: string;
    createdAt: Date;
    platform: string;
  }[];
  id: string;
}

export default function EditProfileForm({ user }: { user: User }) {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<User>(user);
  const redirect = useRouter();
  const blobResult: string[] = [];


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json() as PutBlobResult;

        blobResult.push(result.url);

      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error('Error uploading image:', error);
        return;
      }
    }
    try {
      if (userData.image) {
        data.image = userData.image;
      }

      if (blobResult.length > 0) {
        data.image = blobResult[0];
      }

      const res = await fetch('/api/update-profile', {
        method: 'PUT',
        body: data && JSON.stringify({ id: userData.id, data }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

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
            <label htmlFor="image" className="label">Max file size 4MB</label>
          </fieldset>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              defaultValue={userData.name ? userData.name : ""}
              className="mt-1 rounded border-1 border-primary shadow-sm"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Bio</span>
            <textarea
              name="bio"
              defaultValue={userData.bio ? userData.bio : ""}
              className="mt-1 rounded border-1 border-primary shadow-sm"
              rows={2}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Address</span>
            <input
              type="text"
              name="address"
              defaultValue={userData.address ? userData.address : ""}
              className="mt-1 rounded border-1 border-primary shadow-sm"
            />
          </label>
          {Array.isArray(userData.phone) ? userData.phone.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                name={`phone[${idx}]`}
                defaultValue={p}
                className="mt-1 rounded border-1 border-primary shadow-sm"
              />
              <button
                type="button"
                // onClick={() => handleRemovePhone(idx)}
                className="mt-1 text-red-500"
              >
                Remove
              </button>
            </div>
          )) : <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Phone</span>
            <input
              type="text"
              name="phone[0]"
              defaultValue={userData.phone ? userData.phone : ""}
              className="mt-1 rounded border-1 border-primary shadow-sm"
            />
          </label>
          }


          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Website</span>
            <input
              type="url"
              name="website"
              defaultValue={userData.website ? userData.website : ""}
              className="mt-1 rounded border-1 border-primary shadow-sm"
            />
          </label>

          <div>

            <span className="font-semibold text-gray-700">Socials</span>
            <div className="flex flex-col gap-2 mt-1">
              {Array.isArray(userData.socials) && userData.socials.length > 0 ? (
                userData.socials.map((social, idx) => (
                  <div key={social.id} className="flex gap-2">
                    <input
                      type="text"
                      name={`socials[${idx}].platform`}
                      defaultValue={social.platform}
                      placeholder="Platform"
                      className="rounded border-1 border-primary shadow-sm flex-1"
                    />
                    <input
                      type="text"
                      name={`socials[${idx}].url`}
                      defaultValue={social.url}
                      placeholder="URL"
                      className="rounded border-1 border-primary shadow-sm flex-1"
                    />
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No social media links available</span>
              )}
            </div>
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
