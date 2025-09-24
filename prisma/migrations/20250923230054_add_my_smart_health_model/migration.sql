-- CreateTable
CREATE TABLE "public"."MySmartHealth" (
    "id" TEXT NOT NULL,
    "generalTitle" TEXT,
    "paragraph" TEXT[],
    "images" TEXT[],
    "files" TEXT[],

    CONSTRAINT "MySmartHealth_pkey" PRIMARY KEY ("id")
);
