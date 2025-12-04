import CategoryIndex from '@/components/pages/CategoryIndex';
import { PROFILE_TYPE_THE_LEADING_DOCTORS } from '@/utils/constants';

export default async function TheLeadingDoctorsPage() {
  return <CategoryIndex profileType={PROFILE_TYPE_THE_LEADING_DOCTORS} />;
}
