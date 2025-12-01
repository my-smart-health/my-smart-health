'use client';

import { AdminNotification } from '@/utils/types';
import { useState, useRef, useEffect } from 'react';
import { Archive, Trash2, Key, Clock, CheckCheck } from 'lucide-react';

type Props = {
  initialNotifications: AdminNotification[];
};

type ModalType = 'reset' | 'archive' | 'unarchive' | 'delete' | 'error' | null;

export default function PasswordRequestsList({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const successModalRef = useRef<HTMLDialogElement>(null);
  const errorModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleModalClose = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSelectedNotification(null);
        setModalType(null);
      }, 100);
    };

    const handleSuccessModalClose = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setNewPassword(null);
        setCopySuccess(false);
      }, 100);
    };

    const handleErrorModalClose = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMessage('');
      }, 100);
    };

    const modal = modalRef.current;
    const successModal = successModalRef.current;
    const errorModal = errorModalRef.current;

    modal?.addEventListener('close', handleModalClose);
    successModal?.addEventListener('close', handleSuccessModalClose);
    errorModal?.addEventListener('close', handleErrorModalClose);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      modal?.removeEventListener('close', handleModalClose);
      successModal?.removeEventListener('close', handleSuccessModalClose);
      errorModal?.removeEventListener('close', handleErrorModalClose);
    };
  }, []);

  const openModal = (notification: AdminNotification, type: ModalType) => {
    setSelectedNotification(notification);
    setModalType(type);
    setNewPassword(null);
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const closeSuccessModal = () => {
    successModalRef.current?.close();
  };

  const extractEmailFromMessage = (message: string): string | null => {
    const match = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleResetPassword = async () => {
    if (!selectedNotification) return;

    const email = extractEmailFromMessage(selectedNotification.message);
    if (!email) {
      setMessage('E-Mail konnte nicht aus der Nachricht extrahiert werden');
      closeModal();
      errorModalRef.current?.showModal();
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: selectedNotification.id,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewPassword(data.newPassword);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id
              ? { ...n, isRead: true, resetReadAt: new Date().toISOString(), archivedAt: new Date().toISOString() }
              : n
          )
        );

        setIsProcessing(false);
        closeModal();
        setTimeout(() => {
          successModalRef.current?.showModal();
        }, 150);
      } else {
        setMessage(data.message || 'Fehler beim Zurücksetzen des Passworts');
        setIsProcessing(false);
        closeModal();
        setTimeout(() => {
          errorModalRef.current?.showModal();
        }, 150);
      }
    } catch {
      setMessage('Ein Fehler ist aufgetreten');
      setIsProcessing(false);
      closeModal();
      setTimeout(() => {
        errorModalRef.current?.showModal();
      }, 150);
    }
  };

  const handleArchive = async () => {
    if (!selectedNotification) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/password/archive-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: selectedNotification.id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id ? { ...n, archivedAt: new Date().toISOString() } : n
          )
        );
        setIsProcessing(false);
        closeModal();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Fehler beim Archivieren');
        setIsProcessing(false);
        closeModal();
        setTimeout(() => {
          errorModalRef.current?.showModal();
        }, 150);
      }
    } catch {
      setMessage('Ein Fehler ist aufgetreten');
      setIsProcessing(false);
      closeModal();
      setTimeout(() => {
        errorModalRef.current?.showModal();
      }, 150);
    }
  };

  const handleUnarchive = async () => {
    if (!selectedNotification) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/password/archive-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: selectedNotification.id, unarchive: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id ? { ...n, archivedAt: null } : n
          )
        );
        setIsProcessing(false);
        closeModal();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Fehler beim Wiederherstellen');
        setIsProcessing(false);
        closeModal();
        setTimeout(() => {
          errorModalRef.current?.showModal();
        }, 150);
      }
    } catch {
      setMessage('Ein Fehler ist aufgetreten');
      setIsProcessing(false);
      closeModal();
      setTimeout(() => {
        errorModalRef.current?.showModal();
      }, 150);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/password/delete-notification', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: selectedNotification.id }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
        setIsProcessing(false);
        closeModal();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Fehler beim Löschen');
        setIsProcessing(false);
        closeModal();
        setTimeout(() => {
          errorModalRef.current?.showModal();
        }, 150);
      }
    } catch {
      setMessage('Ein Fehler ist aufgetreten');
      setIsProcessing(false);
      closeModal();
      setTimeout(() => {
        errorModalRef.current?.showModal();
      }, 150);
    }
  };

  const filteredNotifications = showArchived
    ? notifications
    : notifications.filter((n) => !n.archivedAt);

  const pendingCount = notifications.filter((n) => !n.isRead && !n.archivedAt).length;

  return (
    <>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setShowArchived(false)}
          className={`btn ${!showArchived ? 'btn-primary' : 'btn-outline'}`}
        >
          Ausstehend ({pendingCount})
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`btn ${showArchived ? 'btn-primary' : 'btn-outline'}`}
        >
          Alle anzeigen ({notifications.length})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center p-12 bg-base-200 rounded-lg">
          <p className="text-gray-600">
            {showArchived ? 'Keine Anfragen vorhanden' : 'Keine ausstehenden Anfragen'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const email = extractEmailFromMessage(notification.message);
            return (
              <div
                key={notification.id}
                className={`card bg-base-100 shadow-md ${notification.archivedAt ? 'opacity-60' : ''
                  } ${!notification.isRead && !notification.archivedAt ? 'border-l-4 border-primary' : ''}`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notification.isRead ? (
                          <CheckCheck className="text-success" size={20} />
                        ) : (
                          <Clock className="text-warning" size={20} />
                        )}
                        <h3 className="font-semibold text-lg">{email || 'E-Mail nicht gefunden'}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Erstellt: {new Date(notification.createdAt).toLocaleString('de-DE')}</p>
                        {notification.resetReadAt && (
                          <p>Zurückgesetzt: {new Date(notification.resetReadAt).toLocaleString('de-DE')}</p>
                        )}
                        {notification.archivedAt && (
                          <p>Archiviert: {new Date(notification.archivedAt).toLocaleString('de-DE')}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.archivedAt ? (
                        <>
                          <button
                            onClick={() => openModal(notification, 'reset')}
                            className="btn btn-sm btn-primary"
                            title="Passwort zurücksetzen"
                          >
                            <Key size={16} />
                            Zurücksetzen
                          </button>
                          <button
                            onClick={() => openModal(notification, 'archive')}
                            className="btn btn-sm btn-outline"
                            title="Archivieren"
                          >
                            <Archive size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openModal(notification, 'unarchive')}
                          className="btn btn-sm btn-success btn-outline"
                          title="Wiederherstellen"
                        >
                          <Archive size={16} />
                          Wiederherstellen
                        </button>
                      )}
                      <button
                        onClick={() => openModal(notification, 'delete')}
                        className="btn btn-sm btn-error btn-outline"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {modalType === 'reset' && 'Passwort zurücksetzen?'}
            {modalType === 'archive' && 'Anfrage archivieren?'}
            {modalType === 'unarchive' && 'Anfrage wiederherstellen?'}
            {modalType === 'delete' && 'Anfrage löschen?'}
          </h3>
          <p className="py-4">
            {modalType === 'reset' &&
              'Ein neues zufälliges Passwort wird generiert und dem Benutzer zugewiesen.'}
            {modalType === 'archive' && 'Die Anfrage wird archiviert, bleibt aber in der Datenbank.'}
            {modalType === 'unarchive' && 'Die Anfrage wird wiederhergestellt und erscheint wieder bei den aktiven Benachrichtigungen.'}
            {modalType === 'delete' &&
              'Die Anfrage wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'}
          </p>
          <div className="modal-action">
            <button onClick={closeModal} className="btn btn-outline" disabled={isProcessing}>
              Abbrechen
            </button>
            <button
              onClick={
                modalType === 'reset'
                  ? handleResetPassword
                  : modalType === 'archive'
                    ? handleArchive
                    : modalType === 'unarchive'
                      ? handleUnarchive
                      : handleDelete
              }
              className={`btn ${modalType === 'delete' ? 'btn-error' : 'btn-primary'}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Bestätigen'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal}>close</button>
        </form>
      </dialog>

      <dialog ref={successModalRef} className="modal modal-bottom sm:modal-middle fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4 text-success">Passwort erfolgreich zurückgesetzt!</h3>
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Neues Passwort:</p>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-mono font-bold text-primary bg-white px-4 py-2 rounded flex-1 text-center">
                {newPassword}
              </code>
              <button
                onClick={() => {
                  if (newPassword) {
                    navigator.clipboard.writeText(newPassword);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }
                }}
                className="btn btn-sm btn-outline"
              >
                {copySuccess ? '✓ Kopiert!' : 'Kopieren'}
              </button>
            </div>
          </div>
          <p className="text-sm text-warning mb-4">
            ⚠️ Bitte notieren oder kopieren Sie dieses Passwort. Es wird nur einmal angezeigt!
          </p>
          <p className="text-sm text-gray-600">
            Teilen Sie dieses Passwort dem Benutzer mit. Der Benutzer sollte das Passwort nach der Anmeldung ändern.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button type="button" onClick={closeSuccessModal} className="btn btn-primary">
                Verstanden
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeSuccessModal}>close</button>
        </form>
      </dialog>

      <dialog ref={errorModalRef} className="modal modal-bottom sm:modal-middle fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4 text-error">Fehler</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <form method="dialog">
              <button type="button" onClick={() => errorModalRef.current?.close()} className="btn btn-primary">
                OK
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => errorModalRef.current?.close()}>close</button>
        </form>
      </dialog>
    </>
  );
}
