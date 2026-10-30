// apps/app/lib/messaging/scan-message.ts

export interface ScanRequested {
  eventId: string;
  scanId: string;
  projectId: string;
  url: string;
  requestedAt: string;
}