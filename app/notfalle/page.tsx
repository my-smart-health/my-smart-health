import CategoryIndex from '@/components/pages/CategoryIndex';
import { PROFILE_TYPE_NOTFALLE } from '@/utils/constants';

export default async function NotfallePage() {
  return <CategoryIndex profileType={PROFILE_TYPE_NOTFALLE} />;
}
