'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';

type ContactDoctor = {
  id: string;
  name: string | null;
  profileImages: string[] | null;
  fieldOfExpertise: Array<{ name: string }> | null;
  displayEmail: string | null;
  phones: string[];
};

type ContactsSectionProps = {
  memberId: string;
  contacts: ContactDoctor[];
  setContacts: (contacts: ContactDoctor[]) => void;
  onAddClick: () => void;
};

export function ContactsSection({
  memberId,
  contacts,
  setContacts,
  onAddClick
}: ContactsSectionProps) {
  const handleRemoveContact = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/member/contacts?memberId=${memberId}&doctorId=${doctorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== doctorId));
      }
    } catch (error) {
      console.error('Error removing contact:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-primary font-bold text-xl">Contacts</h2>
        <button
          type="button"
          onClick={onAddClick}
          className="btn btn-primary btn-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contacts added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="card bg-base-100 border border-primary shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body p-4">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-lg border border-primary">
                      {contact.profileImages && contact.profileImages[0] ? (
                        <Image
                          src={contact.profileImages[0]}
                          alt={contact.name || 'Profile'}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {contact.name || 'Unnamed'}
                    </h3>

                    {contact.fieldOfExpertise && contact.fieldOfExpertise.length > 0 && (
                      <p className="text-sm text-gray-600 truncate">
                        {contact.fieldOfExpertise.map(field => field.name).join(', ')}
                      </p>
                    )}

                    {contact.displayEmail && (
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <Mail className="w-3 h-3 text-primary" />
                        <Link
                          href={`mailto:${contact.displayEmail}`}
                          className="text-blue-600 hover:underline truncate"
                        >
                          {contact.displayEmail}
                        </Link>
                      </div>
                    )}

                    {contact.phones && contact.phones.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <Phone className="w-3 h-3 text-primary" />
                        <Link
                          href={`tel:${contact.phones[0]}`}
                          className="text-blue-600 hover:underline truncate"
                        >
                          {contact.phones[0]}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions justify-end mt-3 gap-2">
                  <Link
                    href={`/profile/${contact.id}`}
                    className="btn btn-primary btn-sm"
                    target="_blank"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="btn btn-error btn-sm text-white gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
