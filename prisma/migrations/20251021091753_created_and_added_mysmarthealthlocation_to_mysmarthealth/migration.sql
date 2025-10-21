-- CreateTable
CREATE TABLE "public"."MySmartHealthLocation" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT[],
    "schedule" JSONB,
    "mySmartHealthId" TEXT,

    CONSTRAINT "MySmartHealthLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MySmartHealthLocation" ADD CONSTRAINT "MySmartHealthLocation_mySmartHealthId_fkey" FOREIGN KEY ("mySmartHealthId") REFERENCES "public"."MySmartHealth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
