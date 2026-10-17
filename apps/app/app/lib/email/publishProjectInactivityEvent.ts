import { publishEmailEvent } from "../rabbitmq";

type Level = "week1" | "week2" | "week3";

interface Props {
  email: string;
  name?: string;
  projectName: string;
  level: Level;
  bugCount: number;
  lastActivityAt: Date;
}

export async function publishProjectInactivityEvent({
  email,
  name,
  projectName,
  level,
  bugCount,
  lastActivityAt,
}: Props) {

  const event = {
    eventType: "PROJECT_INACTIVITY_DETECTED",
    email,
    name,
    projectName,
    level,
    bugCount,
    lastActivityAt: lastActivityAt.toISOString(),
  };

  await publishEmailEvent(event);

}