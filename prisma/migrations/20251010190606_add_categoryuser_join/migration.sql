/*
  Warnings:

  - You are about to drop the column `category` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileType` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('SMART_HEALTH', 'MEDIZIN_UND_PFLEGE');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "category",
DROP COLUMN "profileType",
DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryUser" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "order" INTEGER,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryUser_categoryId_order_idx" ON "public"."CategoryUser"("categoryId", "order");

-- CreateIndex
CREATE INDEX "CategoryUser_userId_idx" ON "public"."CategoryUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryUser_categoryId_userId_key" ON "public"."CategoryUser"("categoryId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryUser" ADD CONSTRAINT "CategoryUser_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryUser" ADD CONSTRAINT "CategoryUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
