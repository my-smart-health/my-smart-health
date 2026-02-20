import { $Enums } from '@prisma/client';
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

export type RegisterFormProps = {
  role?: 'USER' | 'MEMBER';
};

export type HealthInsurances = {
  provider: string;
  insuranceName: string;
  insuranceNumber: string;
  phone: string;
};

export type FileWithDescription = {
  url: string;
  description?: string;
};

export type MemberDocument = FileWithDescription;

export type Allergies = {
  name: string;
  severity: string;
};

export type Intolerances = {
  name: string;
  severity: string;
};

export type MyDoctors = {
  name: string;
  specialty: string;
  emails?: string[];
  phones?: string[];
};

export type Illnesses = {
  highBloodPressure: boolean | null;
  diabetes: boolean | null;
  heartDisease: boolean | null;
  stroke: boolean | null;
  asthma: boolean | null;
  allergies: boolean | null;
  thyroidDisorders: boolean | null;
  gastrointestinalDiseases: boolean | null;
  liverDisorders: boolean | null;
  kidneyDiseases: boolean | null;
  rheumatism: boolean | null;
  autoimmuneDiseases: boolean | null;
  cancer: boolean | null;
  mentalHealthDisorders: boolean | null;
  infectiousDiseases: boolean | null;
  other: string | null;
};

export type HospitalStays = {
  year: number;
  treatment: string;
  hospital: string;
};

export type MedicationPlanTable = {
  medication: string;
  dosage: string;
  sinceWhen: string;
  reason: string;
  fileUrl: FileWithDescription[] | null;
};

export type MedicationPlan = {
  medicationPlanTable: MedicationPlanTable[];
  noRegularMedications: boolean | null;
};

export type AllergiesIntolerances = {
  noneKnown: boolean | null;
  medications: boolean | null;
  foods: boolean | null;
  pollen: boolean | null;
  petHair: boolean | null;
  other: string | null;
  typeOfReaction: string | null;
};

export type FamilyHistoryOfIllness = {
  cardiovascularDisease: boolean | null;
  diabetes: boolean | null;
  cancer: boolean | null;
  hereditaryDiseases: boolean | null;
  mentalHealthConditions: boolean | null;
  noKnownRelevantIllnesses: boolean | null;
};

export type Lifestyle = {
  isSmoking: boolean | null;
  cigarettesPerDay: number | null;
  alcohol: 'NO' | 'OCCASIONALLY' | 'REGULARLY';
  exercise: 'NO' | 'LITTLE' | 'MODERATE' | 'REGULARLY';
  diet: 'BALANCED' | 'VEGETARIAN' | 'VEGAN' | 'UNBALANCED';
  stressLevel: 'LOW' | 'MODERATE' | 'HIGH';
};

export type VaccinationStatus = {
  tetanus: boolean | null;
  measles: boolean | null;
  hepatitisB: boolean | null;
  influenza: boolean | null;
  covid19: boolean | null;
  unknown: boolean | null;
  other: string | null;
};

export type Anamneses = {
  text: string;
  illnesses: Illnesses;
  hospitalStays: HospitalStays[];
  medicationPlan: MedicationPlan;
  allergiesIntolerances: AllergiesIntolerances;
  familyHistoryOfIllnesses: FamilyHistoryOfIllness;
  lifestyle: Lifestyle;
  vaccinationStatus: VaccinationStatus;
};

export type FamilyMember = {
  name: string;
  phones: string[];
};

export type TelMedicinePhoneNumber = {
  type: string;
  phone: string;
  description?: string;
};

export type MemberProfileDashboardProps = {
  id: string;
  email: string;
  role: $Enums.Role;
  createdAt: string;
  name: string | null;
  birthday: string | null;
  heightCm: number | null;
  weightKg: number | null;
  healthInsurances: HealthInsurances[];
  bloodType: $Enums.BloodType | null;
  bloodTypeFiles: FileWithDescription[];
  anamneses: Anamneses[];
  documents: FileWithDescription[];
  doctors: MyDoctors[];
  familyMembers: FamilyMember[];
  updatedAt: string;
  isActive: boolean;
  activeUntil: string | null;
  telMedicineNumbers: TelMedicinePhoneNumber[];
} | null;
