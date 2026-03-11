-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('LIKE', 'HEART');

-- AlterTable
ALTER TABLE "public"."Event"
ADD COLUMN "taskStatus" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
ADD COLUMN "completedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."EventComment" (
  "id" TEXT NOT NULL,
  "familyTreeId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "createdById" TEXT,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EventComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventReaction" (
  "id" TEXT NOT NULL,
  "familyTreeId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "type" "public"."ReactionType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EventReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_familyTreeId_taskStatus_startsAt_idx" ON "public"."Event"("familyTreeId", "taskStatus", "startsAt");

-- CreateIndex
CREATE INDEX "EventComment_familyTreeId_eventId_createdAt_idx" ON "public"."EventComment"("familyTreeId", "eventId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventReaction_eventId_createdById_type_key" ON "public"."EventReaction"("eventId", "createdById", "type");

-- CreateIndex
CREATE INDEX "EventReaction_familyTreeId_eventId_createdAt_idx" ON "public"."EventReaction"("familyTreeId", "eventId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."EventComment" ADD CONSTRAINT "EventComment_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventComment" ADD CONSTRAINT "EventComment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventComment" ADD CONSTRAINT "EventComment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventReaction" ADD CONSTRAINT "EventReaction_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventReaction" ADD CONSTRAINT "EventReaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventReaction" ADD CONSTRAINT "EventReaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
