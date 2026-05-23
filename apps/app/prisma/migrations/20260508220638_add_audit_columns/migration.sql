-- This is an empty migration.
-- DropForeignKey
ALTER TABLE "AuditLog"
DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "AuditLog_userId_idx";
