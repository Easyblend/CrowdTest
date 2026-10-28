-- CreateTable
CREATE TABLE "AutomatedFinding" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "request" TEXT,
    "statusCode" INTEGER,
    "error" TEXT,
    "stack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomatedFinding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomatedFinding" ADD CONSTRAINT "AutomatedFinding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
