'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface EditCategoryModalProps {
  isOpen: boolean;
  initialName: string;
  initialNameEn?: string;
  onClose: () => void;
  onSubmit: (name: string, nameEn?: string) => void;
  title?: string;
}

export default function EditCategoryModal({ isOpen, initialName, initialNameEn, onClose, onSubmit, title }: EditCategoryModalProps) {
  const [name, setName] = useState(initialName ?? '');
  const [nameEn, setNameEn] = useState(initialNameEn ?? '');
  const t = useTranslations('EditCategoryModal');

  useEffect(() => {
    if (isOpen) {
      setName(initialName ?? '');
      setNameEn(initialNameEn ?? '');
    }
  }, [isOpen, initialName, initialNameEn]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), nameEn.trim() || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{title ?? t('defaultTitle')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('label')}
            </label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="categoryNameEn" className="block text-sm font-medium text-gray-700 mb-2">
              {t('labelEn')}
            </label>
            <input
              type="text"
              id="categoryNameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholderEn')}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">{t('cancel')}</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
