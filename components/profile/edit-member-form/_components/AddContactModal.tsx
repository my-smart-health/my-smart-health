'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Search, UserPlus } from 'lucide-react';

type UserSearchResult = {
  id: string;
  name: string | null;
  profileImages: string[] | null;
  fieldOfExpertise: Array<{ name: string }> | null;
  displayEmail: string | null;
  phones: string[];
};

type AddContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  onContactAdded: (contact: UserSearchResult) => void;
  existingContactIds: string[];
  isAdmin: boolean;
};

export function AddContactModal({
  isOpen,
  onClose,
  memberId,
  onContactAdded,
  existingContactIds,
  isAdmin,
}: AddContactModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = isAdmin ?
        await fetch('/api/users/all-doctors') :
        await fetch('/api/users/all-contactable-doctors');

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen, fetchAllUsers]);

  const handleAddContact = async (doctorId: string) => {
    try {
      const response = await fetch('/api/member/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, doctorId }),
      });

      if (!response.ok) throw new Error('Failed to add contact');

      const addedContact = users.find(u => u.id === doctorId);
      if (addedContact) {
        onContactAdded(addedContact);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contact');
    }
  };

  const filteredUsers = users.filter(user => {
    if (existingContactIds.includes(user.id)) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const name = (user.name || '').toLowerCase();
    const email = (user.displayEmail || '').toLowerCase();
    const specialty = (user.fieldOfExpertise || [])
      .map((f) => (typeof f?.name === 'string' ? f.name.toLowerCase() : ''))
      .filter((value) => value.length > 0)
      .join(' ');

    return name.includes(query) || email.includes(query) || specialty.includes(query);
  });

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Add Contact</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="form-control mb-4">
          <div className="input-group">
            <span className="bg-primary text-white">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email or specialty..."
              className="p-2 rounded border border-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No users found' : 'No available users'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="card bg-base-100 border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-lg border border-primary">
                          {user.profileImages && user.profileImages[0] ? (
                            <Image
                              src={user.profileImages[0]}
                              alt={user.name || 'Profile'}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">
                          {user.name || 'Unnamed'}
                        </h4>
                        {user.fieldOfExpertise && user.fieldOfExpertise.length > 0 && (
                          <p className="text-sm text-gray-600 truncate">
                            {user.fieldOfExpertise
                              .map((f) => (typeof f?.name === 'string' ? f.name : ''))
                              .filter((value) => value.length > 0)
                              .join(', ')}
                          </p>
                        )}
                        {user.displayEmail && (
                          <p className="text-xs text-gray-500 truncate">
                            {user.displayEmail}
                          </p>
                        )}
                        {user.phones && user.phones.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {user.phones[0]}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddContact(user.id)}
                        className="btn btn-primary btn-sm gap-1"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button type="button" onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}
