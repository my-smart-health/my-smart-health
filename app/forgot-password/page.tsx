'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type ResponseStatus = 'success' | 'error' | 'not-found' | null;

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ResponseStatus>(null);
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleModalClose = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 100);
    };

    const modal = modalRef.current;
    modal?.addEventListener('close', handleModalClose);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      modal?.removeEventListener('close', handleModalClose);
    };
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email.trim())) {
      setStatus('error');
      setMessage(t('validation.invalidEmail'));
      modalRef.current?.showModal();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/password/request-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || t('messages.success'));
        setEmail('');
        setIsSubmitting(false);
        modalRef.current?.showModal();
      } else if (response.status === 404) {
        setStatus('not-found');
        setMessage(data.message || t('messages.notFound'));
        setIsSubmitting(false);
        modalRef.current?.showModal();
      } else if (response.status === 409) {
        setStatus('error');
        setMessage(data.message || t('messages.conflict'));
        setIsSubmitting(false);
        modalRef.current?.showModal();
      } else {
        setStatus('error');
        setMessage(data.message || t('messages.error'));
        setIsSubmitting(false);
        modalRef.current?.showModal();
      }
    } catch {
      setStatus('error');
      setMessage(t('messages.error'));
      setIsSubmitting(false);
      modalRef.current?.showModal();
    }
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  return (
    <div className="min-h-screen flex justify-center p-2">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{t('title')}</h1>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>{t('notice.title')}</strong> {t('notice.text')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">{t('form.emailLabel')}</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('form.emailPlaceholder')}
                  className="input input-bordered w-full pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {t('form.submitting')}
                </>
              ) : (
                t('form.submit')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-primary hover:underline">
              {t('links.backToLogin')}
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {t('links.contactText')}
              <Link href="/kontakt" className="text-primary hover:underline mx-1">
                {t('links.contactLink')}
              </Link>
              {t('links.contactEnd')}
            </p>
          </div>
        </div>
      </div>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50">
        <div className="modal-box">
          <h3 className={`font-bold text-lg mb-4 ${status === 'success' ? 'text-success' :
            status === 'not-found' ? 'text-warning' :
              'text-error'
            }`}>
            {status === 'success' ? t('modal.successTitle') :
              status === 'not-found' ? t('modal.notFoundTitle') :
                t('modal.errorTitle')}
          </h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <form method="dialog">
              <button type="button" onClick={closeModal} className="btn btn-primary">
                {t('modal.confirm')}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal}>{t('modal.close')}</button>
        </form>
      </dialog>
    </div>
  );
}