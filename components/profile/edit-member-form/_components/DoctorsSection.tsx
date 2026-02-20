import { MyDoctors } from '@/utils/types';

type DoctorsSectionProps = {
  doctors: MyDoctors[];
  setDoctors: (val: MyDoctors[]) => void;
};

export function DoctorsSection({
  doctors,
  setDoctors,
}: DoctorsSectionProps) {
  const handleAdd = () => {
    setDoctors([...doctors, { name: '', specialty: '', emails: [], phones: [] }]);
  };

  const handleRemove = (index: number) => {
    setDoctors(doctors.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'name' | 'specialty', value: string) => {
    const updated = [...doctors];
    updated[index] = { ...updated[index], [field]: value };
    setDoctors(updated);
  };

  const handleAddEmail = (index: number) => {
    const updated = [...doctors];
    updated[index] = {
      ...updated[index],
      emails: [...(updated[index].emails || []), ''],
    };
    setDoctors(updated);
  };

  const handleRemoveEmail = (doctorIndex: number, emailIndex: number) => {
    const updated = [...doctors];
    updated[doctorIndex] = {
      ...updated[doctorIndex],
      emails: (updated[doctorIndex].emails || []).filter((_, i) => i !== emailIndex),
    };
    setDoctors(updated);
  };

  const handleEmailChange = (doctorIndex: number, emailIndex: number, value: string) => {
    const updated = [...doctors];
    const updatedEmails = [...(updated[doctorIndex].emails || [])];
    updatedEmails[emailIndex] = value;
    updated[doctorIndex] = { ...updated[doctorIndex], emails: updatedEmails };
    setDoctors(updated);
  };

  const handleAddPhone = (index: number) => {
    const updated = [...doctors];
    updated[index] = {
      ...updated[index],
      phones: [...(updated[index].phones || []), ''],
    };
    setDoctors(updated);
  };

  const handleRemovePhone = (doctorIndex: number, phoneIndex: number) => {
    const updated = [...doctors];
    updated[doctorIndex] = {
      ...updated[doctorIndex],
      phones: (updated[doctorIndex].phones || []).filter((_, i) => i !== phoneIndex),
    };
    setDoctors(updated);
  };

  const handlePhoneChange = (doctorIndex: number, phoneIndex: number, value: string) => {
    const updated = [...doctors];
    const updatedPhones = [...(updated[doctorIndex].phones || [])];
    updatedPhones[phoneIndex] = value;
    updated[doctorIndex] = { ...updated[doctorIndex], phones: updatedPhones };
    setDoctors(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">My Doctors</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Doctor
          </button>
        </div>
        <div className="space-y-4">
          {doctors.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No doctors added yet</p>
          ) : (
            doctors.map((doctor, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">Doctor #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={doctor.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  placeholder="Doctor Name"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <input
                  type="text"
                  value={doctor.specialty}
                  onChange={e => handleChange(index, 'specialty', e.target.value)}
                  placeholder="Specialty (e.g., Cardiology)"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Emails</span>
                    <button
                      type="button"
                      onClick={() => handleAddEmail(index)}
                      className="btn btn-xs btn-primary text-white"
                    >
                      + Add Email
                    </button>
                  </div>
                  {(doctor.emails || []).map((email, emailIndex) => (
                    <div key={emailIndex} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => handleEmailChange(index, emailIndex, e.target.value)}
                        placeholder="doctor@example.com"
                        className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(index, emailIndex)}
                        className="btn btn-xs btn-error text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Phones</span>
                    <button
                      type="button"
                      onClick={() => handleAddPhone(index)}
                      className="btn btn-xs btn-primary text-white"
                    >
                      + Add Phone
                    </button>
                  </div>
                  {(doctor.phones || []).map((phone, phoneIndex) => (
                    <div key={phoneIndex} className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => handlePhoneChange(index, phoneIndex, e.target.value)}
                        placeholder="+49 123 456789"
                        className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index, phoneIndex)}
                        className="btn btn-xs btn-error text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
