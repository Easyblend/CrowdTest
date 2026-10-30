import { getRabbitMQChannel } from "./rabbitmq";
import type { ScanRequested } from "./scan-message";

export async function publishScanRequest(
    payload: ScanRequested
) {
    const channel = await getRabbitMQChannel();

    channel.sendToQueue(
        "scan-requests",
        Buffer.from(JSON.stringify(payload)),
        {
            persistent: true,
            contentType: "application/json",
        }
    );

    console.log("Scan request published:", payload.scanId);

    await channel.close();
}