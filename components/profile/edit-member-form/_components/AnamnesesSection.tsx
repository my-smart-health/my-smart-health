import { Anamneses, Illnesses, HospitalStays, MedicationPlanTable, AllergiesIntolerances, FamilyHistoryOfIllness, Lifestyle, VaccinationStatus } from '@/utils/types';
import {
  IllnessesSection,
  HospitalStaysSection,
  MedicationPlanSection,
  AllergiesIntolerancesSection,
  FamilyHistorySection,
  LifestyleSection,
  VaccinationStatusSection,
} from './anamnesis-sections';
import { deleteMemberFile } from '@/utils/member-files-client';

type AnamnesesSectionProps = {
  memberId: string;
  anamneses: Anamneses[];
  setAnamneses: (val: Anamneses[]) => void;
};

const createDefaultAnamnesis = (): Anamneses => ({
  text: '',
  illnesses: {
    highBloodPressure: null,
    diabetes: null,
    heartDisease: null,
    stroke: null,
    asthma: null,
    allergies: null,
    thyroidDisorders: null,
    gastrointestinalDiseases: null,
    liverDisorders: null,
    kidneyDiseases: null,
    rheumatism: null,
    autoimmuneDiseases: null,
    cancer: null,
    mentalHealthDisorders: null,
    infectiousDiseases: null,
    other: null,
  },
  hospitalStays: [],
  medicationPlan: {
    medicationPlanTable: [],
    noRegularMedications: null,
  },
  allergiesIntolerances: {
    noneKnown: null,
    medications: null,
    foods: null,
    pollen: null,
    petHair: null,
    other: null,
    typeOfReaction: '',
  },
  familyHistoryOfIllnesses: {
    cardiovascularDisease: null,
    diabetes: null,
    cancer: null,
    hereditaryDiseases: null,
    mentalHealthConditions: null,
    noKnownRelevantIllnesses: null,
  },
  lifestyle: {
    isSmoking: false,
    cigarettesPerDay: null,
    alcohol: 'NO',
    exercise: 'NO',
    diet: 'BALANCED',
    stressLevel: 'LOW',
  },
  vaccinationStatus: {
    tetanus: null,
    measles: null,
    hepatitisB: null,
    influenza: null,
    covid19: null,
    unknown: null,
    other: null,
  },
});

export function AnamnesesSection({
  memberId,
  anamneses,
  setAnamneses,
}: AnamnesesSectionProps) {
  const handleAdd = () => {
    setAnamneses([...anamneses, createDefaultAnamnesis()]);
  };

  const handleRemove = async (anamnesisIndex: number) => {
    const currentAnamneses = [...anamneses];
    const selectedAnamnesis = currentAnamneses[anamnesisIndex];

    if (!selectedAnamnesis) {
      return;
    }

    const medicationTable =
      selectedAnamnesis.medicationPlan?.medicationPlanTable || [];

    try {
      for (let medicationIndex = 0; medicationIndex < medicationTable.length; medicationIndex += 1) {
        const medication = medicationTable[medicationIndex];
        const medicationFiles = (medication.fileUrl || []).filter(
          (file) => file.url && file.url.trim().length > 0,
        );

        for (const file of medicationFiles) {
          await deleteMemberFile({
            memberId,
            fileUrl: file.url,
            target: 'anamnesesMedicationPlan',
            anamnesisIndex,
            medicationIndex,
          });
        }
      }

      const updatedAnamneses = currentAnamneses.filter(
        (_, index) => index !== anamnesisIndex,
      );

      setAnamneses(updatedAnamneses);

      const response = await fetch('/api/update/update-member-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memberId,
          data: { anamneses: updatedAnamneses },
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setAnamneses(currentAnamneses);
        window.alert(payload?.message || 'Failed to remove anamnesis entry');
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to remove medication files before deleting anamnesis entry',
      );
    }
  };

  const handleTextChange = (index: number, value: string) => {
    const updated = [...anamneses];
    updated[index] = { ...updated[index], text: value };
    setAnamneses(updated);
  };

  const handleIllnessChange = (anamnesisIndex: number, field: keyof Illnesses, value: boolean | string | null) => {
    const updated = [...anamneses];
    updated[anamnesisIndex] = {
      ...updated[anamnesisIndex],
      illnesses: {
        ...updated[anamnesisIndex].illnesses,
        [field]: value,
      },
    };
    setAnamneses(updated);
  };

  const handleAddHospitalStay = (anamnesisIndex: number) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].hospitalStays = [
      ...updated[anamnesisIndex].hospitalStays,
      { year: new Date().getFullYear(), treatment: '', hospital: '' },
    ];
    setAnamneses(updated);
  };

  const handleRemoveHospitalStay = (anamnesisIndex: number, stayIndex: number) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].hospitalStays = updated[anamnesisIndex].hospitalStays.filter((_, i) => i !== stayIndex);
    setAnamneses(updated);
  };

  const handleHospitalStayChange = (anamnesisIndex: number, stayIndex: number, field: keyof HospitalStays, value: string | number) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].hospitalStays[stayIndex] = {
      ...updated[anamnesisIndex].hospitalStays[stayIndex],
      [field]: value,
    };
    setAnamneses(updated);
  };

  const handleAddMedication = (anamnesisIndex: number) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].medicationPlan.medicationPlanTable = [
      ...updated[anamnesisIndex].medicationPlan.medicationPlanTable,
      { medication: '', dosage: '', sinceWhen: '', reason: '', fileUrl: null },
    ];
    setAnamneses(updated);
  };

  const handleRemoveMedication = async (anamnesisIndex: number, medIndex: number) => {
    const currentAnamneses = [...anamneses];
    const selectedAnamnesis = currentAnamneses[anamnesisIndex];
    const selectedMedication =
      selectedAnamnesis?.medicationPlan?.medicationPlanTable?.[medIndex];

    if (!selectedAnamnesis || !selectedMedication) {
      return;
    }

    const medicationFiles = (selectedMedication.fileUrl || []).filter(
      (file) => file.url && file.url.trim().length > 0,
    );

    try {
      for (const file of medicationFiles) {
        await deleteMemberFile({
          memberId,
          fileUrl: file.url,
          target: 'anamnesesMedicationPlan',
          anamnesisIndex,
          medicationIndex: medIndex,
        });
      }

      const updated = [...currentAnamneses];
      updated[anamnesisIndex] = {
        ...updated[anamnesisIndex],
        medicationPlan: {
          ...updated[anamnesisIndex].medicationPlan,
          medicationPlanTable:
            updated[anamnesisIndex].medicationPlan.medicationPlanTable.filter(
              (_, i) => i !== medIndex,
            ),
        },
      };

      setAnamneses(updated);

      const response = await fetch('/api/update/update-member-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memberId,
          data: { anamneses: updated },
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setAnamneses(currentAnamneses);
        window.alert(payload?.message || 'Failed to update medication plan');
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to remove medication files',
      );
    }
  };

  const handleMedicationChange = (anamnesisIndex: number, medIndex: number, field: keyof MedicationPlanTable, value: string) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].medicationPlan.medicationPlanTable[medIndex] = {
      ...updated[anamnesisIndex].medicationPlan.medicationPlanTable[medIndex],
      [field]: value,
    };
    setAnamneses(updated);
  };

  const handleNoRegularMedications = (anamnesisIndex: number, value: boolean | null) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].medicationPlan.noRegularMedications = value;
    setAnamneses(updated);
  };

  const handleAddMedicationFile = (anamnesisIndex: number, medIndex: number) => {
    const updated = [...anamneses];
    const medication = updated[anamnesisIndex].medicationPlan.medicationPlanTable[medIndex];
    medication.fileUrl = [
      ...(medication.fileUrl || []),
      { url: '', description: '' },
    ];
    setAnamneses(updated);
  };

  const handleRemoveMedicationFile = (anamnesisIndex: number, medIndex: number, fileIndex: number) => {
    const updated = [...anamneses];
    const medication = updated[anamnesisIndex].medicationPlan.medicationPlanTable[medIndex];
    medication.fileUrl = medication.fileUrl?.filter((_, i) => i !== fileIndex) || null;
    setAnamneses(updated);
  };

  const handleMedicationFileChange = (anamnesisIndex: number, medIndex: number, fileIndex: number, field: 'url' | 'description', value: string) => {
    const updated = [...anamneses];
    const medication = updated[anamnesisIndex].medicationPlan.medicationPlanTable[medIndex];
    if (medication.fileUrl) {
      medication.fileUrl[fileIndex] = {
        ...medication.fileUrl[fileIndex],
        [field]: value,
      };
      setAnamneses(updated);
    }
  };

  const handleAllergiesIntolerancesChange = (anamnesisIndex: number, field: keyof AllergiesIntolerances, value: boolean | string | null) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].allergiesIntolerances = {
      ...updated[anamnesisIndex].allergiesIntolerances,
      [field]: value,
    };
    setAnamneses(updated);
  };

  const handleFamilyHistoryChange = (anamnesisIndex: number, field: keyof FamilyHistoryOfIllness, value: boolean | null) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].familyHistoryOfIllnesses = {
      ...updated[anamnesisIndex].familyHistoryOfIllnesses,
      [field]: value,
    };
    setAnamneses(updated);
  };

  const handleLifestyleChange = <K extends keyof Lifestyle>(
    anamnesisIndex: number,
    field: K,
    value: Lifestyle[K],
  ) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].lifestyle = {
      ...updated[anamnesisIndex].lifestyle,
      [field]: value,
    };
    setAnamneses(updated);
  };

  const handleVaccinationChange = (anamnesisIndex: number, field: keyof VaccinationStatus, value: boolean | string | null) => {
    const updated = [...anamneses];
    updated[anamnesisIndex].vaccinationStatus = {
      ...updated[anamnesisIndex].vaccinationStatus,
      [field]: value,
    };
    setAnamneses(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Anamneses (Medical History)</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Anamnesis
          </button>
        </div>
        <div className="space-y-6">
          {anamneses.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No anamneses added yet</p>
          ) : (
            anamneses.map((anamnesis, index) => (
              <div key={index} className="border-2 odd:border-green-300 even:border-green-500 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-primary">Anamnesis #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => void handleRemove(index)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Remove Entry
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History Notes</label>
                  <textarea
                    value={anamnesis.text}
                    onChange={e => handleTextChange(index, e.target.value)}
                    placeholder="Enter detailed medical history notes..."
                    rows={4}
                    className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full resize-none"
                  />
                </div>

                <div className="space-y-3">

                  <IllnessesSection
                    illnesses={anamnesis.illnesses}
                    onChange={(field, value) => handleIllnessChange(index, field, value)}
                  />

                  <HospitalStaysSection
                    hospitalStays={anamnesis.hospitalStays}
                    onAdd={() => handleAddHospitalStay(index)}
                    onRemove={(stayIndex) => handleRemoveHospitalStay(index, stayIndex)}
                    onChange={(stayIndex, field, value) => handleHospitalStayChange(index, stayIndex, field, value)}
                  />

                  <MedicationPlanSection
                    memberId={memberId}
                    anamnesisIndex={index}
                    medicationPlan={anamnesis.medicationPlan}
                    onAddMedication={() => handleAddMedication(index)}
                    onRemoveMedication={(medIndex) => handleRemoveMedication(index, medIndex)}
                    onMedicationChange={(medIndex, field, value) => handleMedicationChange(index, medIndex, field, value)}
                    onNoRegularMedicationsChange={(value) => handleNoRegularMedications(index, value)}
                    onAddFile={(medIndex) => handleAddMedicationFile(index, medIndex)}
                    onRemoveFile={(medIndex, fileIndex) => handleRemoveMedicationFile(index, medIndex, fileIndex)}
                    onFileChange={(medIndex, fileIndex, field, value) => handleMedicationFileChange(index, medIndex, fileIndex, field, value)}
                  />

                  <AllergiesIntolerancesSection
                    allergiesIntolerances={anamnesis.allergiesIntolerances}
                    onChange={(field, value) => handleAllergiesIntolerancesChange(index, field, value)}
                  />

                  <FamilyHistorySection
                    familyHistory={anamnesis.familyHistoryOfIllnesses}
                    onChange={(field, value) => handleFamilyHistoryChange(index, field, value)}
                  />

                  <LifestyleSection
                    lifestyle={anamnesis.lifestyle}
                    onChange={(field, value) => handleLifestyleChange(index, field, value)}
                  />

                  <VaccinationStatusSection
                    vaccinationStatus={anamnesis.vaccinationStatus}
                    onChange={(field, value) => handleVaccinationChange(index, field, value)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
