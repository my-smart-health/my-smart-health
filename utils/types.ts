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
  | 'THE_HEALTH_BAR'
  | 'THE_LEADING_DOCTORS'
  | 'MY_SMART_HEALTH_TERMINE_KURZFRISTIG';

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
  socialLinks: Social[];
};

export type NewsCardType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  photos: string[];
  tags: string[];
  socialLinks: Social[];
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
  reservationLinks?: ReservationLink[];
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
  socialLinks?: { platform: string; url: string }[];
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
  membership?: Membership | null;
  ratingStars?: number | null;
  ratingLink?: string | null;
};

export type CategoryNodeSH = {
  name: string;
  children: Map<string, CategoryNodeSH>;
  users: UserProfileSH[];
};

export const RESERVATION_LINK_TYPES = {
  OnlineTermine: 'Online Termine',
  Rezeptbestellung: 'Rezeptbestellung',
  OnlineReservierungen: 'Online Reservierungen',
  OnlineShop: 'Online Shop',
  Email: 'Email',
} as const;

export type ReservationLinkType =
  (typeof RESERVATION_LINK_TYPES)[keyof typeof RESERVATION_LINK_TYPES];

export type ReservationLink = {
  id: string;
  type: ReservationLinkType;
  url: string;
};

export type Membership = {
  status: boolean;
  link: string;
};

export type AdminNotification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  resetReadAt: string | null;
  archivedAt: string | null;
};
