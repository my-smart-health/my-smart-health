import { Session } from 'next-auth';

import { User } from 'next-auth';

export interface SessionUser extends User {
  role: 'ADMIN' | 'USER';
}

export type NavbarProps = {
  session: Session | null;
};
export type ProfileType =
  | 'SMART_HEALTH'
  | 'MEDIZIN_UND_PFLEGE'
  | 'NOTFALLE'
  | 'THE_HEALTH_BAR';

export type ErrorType = 'error' | 'warning' | 'success';

export type ErrorState = {
  type: ErrorType;
  message: string;
  userId?: string;
} | null;

export type FieldOfExpertise = {
  id: string;
  label: string;
  description: string;
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
    fieldOfExpertise: FieldOfExpertise[];
  };
};

export type Schedule = {
  id: string;
  title?: string;
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

export type Location = {
  id: string;
  address: string;
  phone: string[];
  userId: string;
  schedule: Schedule[];
};

export type Social = { platform: string; url: string };

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  images: string[];
  expiryDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  userId: string;
};

export type CertificateForm = {
  id?: string;
  name: string;
  issuer: string;
  images: string[];
  issueDate: Date | string;
  expiryDate: Date | string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  userId?: string;
};

export type ProfileNewsCarouselItem = {
  id: string;
  authorId: string;
  title: string;
  photos: string[];
};

export type MySmartHealthParagraph = {
  id: string;
  title?: string;
  content: string;
  images?: string[];
  files?: string[];
};

export type MySmartHealthInfo = {
  id: string;
  generalTitle: string;
  paragraph: MySmartHealthParagraph[];
};

export type UserProfileSH = {
  id: string;
  name: string;
  bio?: string;
  profileImages: string[];
  category: string[];
};

export type CategoryNodeSH = {
  name: string;
  children: Map<string, CategoryNodeSH>;
  users: UserProfileSH[];
};
