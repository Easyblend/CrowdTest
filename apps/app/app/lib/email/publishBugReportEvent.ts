import {publishEmailEvent} from "@/lib/rabbitmq";

interface BugReportEmailProps {
  receiverEmail: string;
  projectId: string;
  projectName: string;
  receiverName: string;
  bugTitle: string;
  bugDescription: string;
  severity: string;
  screenshotUrl?: string;
}

export async function publishBugReportEvent({
  receiverEmail,
  projectName,
  projectId,
  receiverName,
  bugTitle,
  bugDescription,
  severity,
  screenshotUrl,
}: BugReportEmailProps) {

const event = {
    eventType: "BUG_REPORTED",
    receiverEmail,
    projectId,
    projectName,
    receiverName,
    bugTitle,
    bugDescription,
    severity,
    screenshotUrl,
  };

  await publishEmailEvent(event);

}
