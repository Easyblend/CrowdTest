import amqp from "amqplib";

export async function getRabbitMQChannel() {
    const rabbitUrl = process.env.RABBITMQ_URL;

    if (!rabbitUrl) {
        throw new Error("RABBITMQ_URL is not configured");
    }

    if (rabbitUrl.includes("localhost")) {
        throw new Error("RabbitMQ is configured to use localhost");
    }

    const connection = await amqp.connect(rabbitUrl);

    const channel = await connection.createChannel();

    await channel.assertQueue("scan-requests", {
        durable: true,
    });

    return channel;
}