-- CreateEnum
CREATE TYPE "BugStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "Bug" ADD COLUMN     "status" "BugStatus" NOT NULL DEFAULT 'OPEN';
