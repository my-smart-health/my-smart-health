import CategoryIndex from '@/components/pages/CategoryIndex';
import { PROFILE_TYPE_MEDIZIN_UND_PFLEGE } from '@/utils/constants';

export default async function MedizinUndPflegePage() {
  return <CategoryIndex profileType={PROFILE_TYPE_MEDIZIN_UND_PFLEGE} />;
}
