-- AlterTable
ALTER TABLE "public"."Posts" ADD COLUMN     "cubeId" TEXT,
ADD COLUMN     "cubeOrder" INTEGER;

-- CreateTable
CREATE TABLE "public"."Cube" (
    "id" TEXT NOT NULL,
    "onOff" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Posts_cubeId_cubeOrder_idx" ON "public"."Posts"("cubeId", "cubeOrder");

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_cubeId_fkey" FOREIGN KEY ("cubeId") REFERENCES "public"."Cube"("id") ON DELETE SET NULL ON UPDATE CASCADE;
