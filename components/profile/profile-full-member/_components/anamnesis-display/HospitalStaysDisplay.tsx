import { Activity } from 'lucide-react';
import { HospitalStays } from '@/utils/types';

type HospitalStaysDisplayProps = {
  hospitalStays: HospitalStays[];
};

export function HospitalStaysDisplay({ hospitalStays }: HospitalStaysDisplayProps) {
  if (!hospitalStays || hospitalStays.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Activity className="text-primary" size={16} />
        Hospital Stays
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="text-left py-2 px-3 font-semibold text-gray-700 border-r border-primary">Year</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 border-r border-primary">Treatment</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Hospital</th>
            </tr>
          </thead>
          <tbody>
            {hospitalStays.map((stay, index) => (
              <tr key={index} className="border-b border-primary last:border-b-0">
                <td className="py-2 px-3 text-gray-900 border-r border-primary">{stay.year}</td>
                <td className="py-2 px-3 text-gray-900 border-r border-primary">{stay.treatment}</td>
                <td className="py-2 px-3 text-gray-900">{stay.hospital}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
