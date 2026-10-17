import { publishEmailEvent } from "../rabbitmq";

interface Bug {
  id: string;
  title: string;
}

interface Props {
  receiverEmail: string;
  receiverName: string;
  projectName: string;
  openBugs: Bug[];
  inProgressBugs: Bug[];
}

export async function publishBugReminderEvent({
  receiverEmail,
  receiverName,
  projectName,
  openBugs,
  inProgressBugs,
}: Props) {
  await publishEmailEvent({
    eventType: "BUG_REMINDER",
    receiverEmail,
    receiverName,
    projectName,
    openBugs,
    inProgressBugs,
  });
}