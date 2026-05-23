-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "actorId" TEXT,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_ownerId_idx" ON "AuditLog"("ownerId");

-- CreateIndex
CREATE INDEX "AuditLog_projectId_idx" ON "AuditLog"("projectId");
