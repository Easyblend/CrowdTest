-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
