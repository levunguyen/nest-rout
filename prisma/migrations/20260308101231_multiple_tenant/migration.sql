/*
  Warnings:

  - Added the required column `familyTreeId` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TreeRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "public"."FamilyMember" ADD COLUMN     "familyTreeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Session" ADD COLUMN     "activeFamilyTreeId" TEXT;

-- CreateTable
CREATE TABLE "public"."FamilyTree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FamilyTreeMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyTreeId" TEXT NOT NULL,
    "role" "public"."TreeRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyTreeMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "familyTreeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."TreeRole" NOT NULL DEFAULT 'VIEWER',
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedByUserId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FamilyTreeMembership_familyTreeId_idx" ON "public"."FamilyTreeMembership"("familyTreeId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyTreeMembership_userId_familyTreeId_key" ON "public"."FamilyTreeMembership"("userId", "familyTreeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "public"."Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_familyTreeId_email_status_idx" ON "public"."Invitation"("familyTreeId", "email", "status");

-- CreateIndex
CREATE INDEX "FamilyMember_familyTreeId_idx" ON "public"."FamilyMember"("familyTreeId");

-- CreateIndex
CREATE INDEX "Session_activeFamilyTreeId_idx" ON "public"."Session"("activeFamilyTreeId");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_activeFamilyTreeId_fkey" FOREIGN KEY ("activeFamilyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FamilyTree" ADD CONSTRAINT "FamilyTree_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FamilyTreeMembership" ADD CONSTRAINT "FamilyTreeMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FamilyTreeMembership" ADD CONSTRAINT "FamilyTreeMembership_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "public"."FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
