import express from "express";
import { ServiceBusClient } from "@azure/service-bus";
import logger from "../utils/logger.js";

const router = express.Router();
router.use(express.json());

async function sendToQueue(queueName, msg, bodyValue) {
    const connectionString = process.env.AZURE_SERVICE_BUS;
    const responseQueueName = "responsecm";

    const serviceBusClient = new ServiceBusClient(connectionString);
    const requestSender = serviceBusClient.createSender(queueName);
    const responseReceiver = serviceBusClient.createReceiver(responseQueueName);

    const requestMessage = {
        body: bodyValue || "error sent",
        applicationProperties: {
            bodyType: msg,
            priority: 1,
        },
        replyTo: responseQueueName,
        messageId: Date.now().toString(),
        contentType: "application/json",
    };

    await requestSender.sendMessages(requestMessage);

    const responseMessage = await responseReceiver.receiveMessages(1);

    if (responseMessage.length > 0) {
        logger.verbose("Received response:", responseMessage[0].body);
        // Complete the response message
        await responseReceiver.completeMessage(responseMessage[0]);
    } else {
        logger.info("No response received within the specified timeout.");
    }

    await requestSender.close();
    await responseReceiver.close();
    await serviceBusClient.close();
    return responseMessage[0].body;
}

export async function sendToQueueFunc(value) {
    return await sendToQueue("customercm", value.typeOfMessage, value.body);
}

export default router;