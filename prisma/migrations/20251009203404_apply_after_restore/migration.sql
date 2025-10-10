/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserCategory" DROP CONSTRAINT "UserCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserCategory" DROP CONSTRAINT "UserCategory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserCategories" DROP CONSTRAINT "_UserCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserCategories" DROP CONSTRAINT "_UserCategories_B_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "category" TEXT[];

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."UserCategory";

-- DropTable
DROP TABLE "public"."_UserCategories";

-- DropEnum
DROP TYPE "public"."CategoryType";
