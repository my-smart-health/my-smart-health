-- DropIndex
DROP INDEX "public"."Category_type_parentId_idx";

-- CreateTable
CREATE TABLE "public"."UserCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "UserCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCategory_userId_idx" ON "public"."UserCategory"("userId");

-- CreateIndex
CREATE INDEX "UserCategory_categoryId_idx" ON "public"."UserCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategory_userId_categoryId_key" ON "public"."UserCategory"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."UserCategory" ADD CONSTRAINT "UserCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCategory" ADD CONSTRAINT "UserCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
