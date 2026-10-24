import { publishEmailEvent } from "@/lib/rabbitmq";

interface AdminNotificationEmailProps {
  subject: string;
  message: string;
  link?: string;
}

export async function publishAdminNotification({
  subject,
  message,
  link,
}: AdminNotificationEmailProps) {

  const event = {
    eventType: "ADMIN_NOTIFICATION",
    subject,
    message,
    link,
  };

  await publishEmailEvent(event);

}