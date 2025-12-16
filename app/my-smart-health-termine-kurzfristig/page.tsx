import CategoryIndex from '@/components/pages/CategoryIndex';
import { PROFILE_TYPE_MY_SMART_HEALTH_TERMINE_KURZFRISTIG } from '@/utils/constants';

export default async function MySmartHealthTermineKurzfristigPage() {
  return <CategoryIndex profileType={PROFILE_TYPE_MY_SMART_HEALTH_TERMINE_KURZFRISTIG} />;
}
