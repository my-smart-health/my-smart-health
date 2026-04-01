'use client';

import { Stethoscope, Mail, Phone } from 'lucide-react';
import { MyDoctors } from '@/utils/types';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type DoctorsSectionProps = {
  doctors: MyDoctors[];
};

export function DoctorsSection({ doctors }: DoctorsSectionProps) {
  const t = useTranslations('MemberProfileFull');
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">{t('doctors.title')}</h3>
      <div className="flex flex-col gap-3">
        {doctors.map((doctor, index) => (
          <div key={index} className="p-4 border border-primary rounded-lg">
            <div className="flex items-start gap-3">
              <Stethoscope className="text-primary mt-1 flex-shrink-0" size={20} />
              <div className="flex-1 space-y-3">
                {doctor.name && (
                  <p className="font-semibold text-gray-900">{doctor.name}</p>
                )}
                {doctor.specialty && (
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                )}

                {((doctor.emails && doctor.emails.filter(e => e?.trim()).length > 0) ||
                  (doctor.phones && doctor.phones.filter(p => p?.trim()).length > 0)) && (
                    <div className="mt-2 pt-2 border-t border-gray-300 space-y-2">
                      {doctor.phones && doctor.phones.filter(p => p?.trim()).length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-2">{t('doctors.phone')}</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.phones.filter(phone => phone?.trim()).map((phone, phoneIdx) => (
                              <Link
                                key={`phone-${phoneIdx}`}
                                href={`tel:${phone}`}
                                className="badge badge-primary py-3 px-3 text-white hover:bg-primary/75 transition-colors duration-200 break-all link inline-flex items-center gap-1"
                              >
                                <Phone size={14} />
                                <span>{phone}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {doctor.emails && doctor.emails.filter(e => e?.trim()).length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-2">{t('doctors.email')}</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.emails.filter(email => email?.trim()).map((email, emailIdx) => (
                              <Link
                                key={`email-${emailIdx}`}
                                href={`mailto:${email}`}
                                className="badge badge-primary py-3 px-3 text-white hover:bg-primary/75 transition-colors duration-200 break-all link inline-flex items-center gap-1"
                              >
                                <Mail size={14} />
                                <span>{email}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
