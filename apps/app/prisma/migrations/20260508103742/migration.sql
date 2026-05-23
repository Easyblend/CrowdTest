/*
  Warnings:

  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "userId",
ADD COLUMN     "actorSnapshot" JSONB,
ADD COLUMN     "ownerSnapshot" JSONB;
