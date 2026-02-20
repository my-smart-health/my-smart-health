-- CreateTable
CREATE TABLE "public"."PatientProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "birthday" TIMESTAMP(3),
    "heightCm" DECIMAL(5,2),
    "weightKg" DECIMAL(5,2),
    "healthInsurances" JSONB,
    "medicationPlan" JSONB,
    "bloodType" TEXT,
    "bloodTypeFiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allergies" JSONB,
    "intolerances" JSONB,
    "anamneses" TEXT,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "doctors" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activeUntil" TIMESTAMP(3),

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FamilyMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "healthUserId" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientDoctor" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "notes" JSONB,

    CONSTRAINT "PatientDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_email_key" ON "public"."PatientProfile"("email");

-- CreateIndex
CREATE INDEX "FamilyMember_healthUserId_idx" ON "public"."FamilyMember"("healthUserId");

-- CreateIndex
CREATE INDEX "PatientDoctor_patientId_idx" ON "public"."PatientDoctor"("patientId");

-- CreateIndex
CREATE INDEX "PatientDoctor_doctorId_idx" ON "public"."PatientDoctor"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoctor_patientId_doctorId_key" ON "public"."PatientDoctor"("patientId", "doctorId");

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_healthUserId_fkey" FOREIGN KEY ("healthUserId") REFERENCES "public"."PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientDoctor" ADD CONSTRAINT "PatientDoctor_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientDoctor" ADD CONSTRAINT "PatientDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
