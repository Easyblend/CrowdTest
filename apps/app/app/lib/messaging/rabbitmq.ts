import amqp from "amqplib";

export async function getRabbitMQChannel() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL!
    );

    const channel = await connection.createChannel();

    await channel.assertQueue("scan-requests", {
        durable: true,
    });

    return channel;
}