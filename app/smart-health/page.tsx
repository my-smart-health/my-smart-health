import CategoryIndex from '@/components/pages/CategoryIndex';
import { PROFILE_TYPE_SMART_HEALTH } from '@/utils/constants';

export default async function SmartHealthPage() {
  return <CategoryIndex profileType={PROFILE_TYPE_SMART_HEALTH} />;
}
