'use client';

import { Shield, Mail, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

type AdminOnlySectionProps = {
  email: string;
  isActive: boolean;
  activeUntil: string | null;
  createdAt: string;
  updatedAt: string;
};

export function AdminOnlySection({
  email,
  isActive,
  activeUntil,
  createdAt,
  updatedAt,
}: AdminOnlySectionProps) {
  const t = useTranslations('MemberProfileFull');
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="w-full p-4 bg-amber-50 rounded-lg border-2 border-primary">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="text-primary" size={20} />
        <h3 className="text-lg font-semibold text-primary">{t('admin.title')}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('admin.email')}</p>
            <p className="text-sm font-medium text-gray-900">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
          ) : (
            <XCircle size={16} className="text-red-600 flex-shrink-0" />
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('admin.status')}</p>
            <p className={`text-sm font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
              {isActive ? t('admin.active') : t('admin.inactive')}
            </p>
          </div>
        </div>

        {activeUntil && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase">{t('admin.activeUntil')}</p>
              <p className="text-sm font-medium text-gray-900">{formatDateTime(activeUntil)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary">
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('admin.created')}</p>
            <p className="text-xs text-gray-700">{formatDateTime(createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{t('admin.updated')}</p>
            <p className="text-xs text-gray-700">{formatDateTime(updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
