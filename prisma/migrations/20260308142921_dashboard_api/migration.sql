-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('BIRTHDAY', 'ANNIVERSARY', 'GATHERING', 'OTHER');

-- AlterTable
ALTER TABLE "public"."FamilyMember" ADD COLUMN     "generation" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "spouseIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "familyTreeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."EventType" NOT NULL DEFAULT 'OTHER',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "location" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_familyTreeId_startsAt_idx" ON "public"."Event"("familyTreeId", "startsAt");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "public"."Event"("type");

-- CreateIndex
CREATE INDEX "FamilyMember_parentId_idx" ON "public"."FamilyMember"("parentId");

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
