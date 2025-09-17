import { Session } from 'next-auth';

import { User } from 'next-auth';

export interface SessionUser extends User {
  role: 'ADMIN' | 'USER';
}

export type NavbarProps = {
  session: Session | null;
};

export type UserAccount = {
  id: string;
  createdAt: Date;
  email: string;
  name?: string | null;
  password: string;
  role: 'ADMIN' | 'USER';
  emailVerified?: Date | null;
  image?: string | null;
  bio?: string | null;
  posts?: Posts[];
};

export type Posts = {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  author: User;
  authorId: string;
};

export type NewsCardType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  photos: string[];
  tags: string[];
  author: {
    id: string;
    name: string;
    fieldOfExpertise: string[];
  };
};

export type Schedule = {
  id: string;
  day: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
  open: string;
  close: string;
};

export type Social = { platform: string; url: string };

export type Certificates = {
  id: string;
  name: string;
  imageUrl: string[];
  issuedBy: string;
  dateIssued: Date;
  validUntil: Date;
};
