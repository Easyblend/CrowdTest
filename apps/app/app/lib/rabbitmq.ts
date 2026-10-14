import amqp from "amqplib";

const QUEUE_NAME = "crowdtest.email";

export async function publishEmailEvent(event: unknown) {
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  if (!rabbitmqUrl) {
    throw new Error("RABBITMQ_URL is not configured");
  }

  const connection = await amqp.connect(rabbitmqUrl);

  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  channel.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
      contentType: "application/json",
    }
  );

  await channel.close();
  await connection.close();
}