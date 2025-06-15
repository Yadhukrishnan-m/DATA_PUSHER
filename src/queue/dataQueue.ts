import Queue from "bull";
import axios from "axios";
import { Log } from "../models/log.model";

const dataQueue = new Queue("data-processing", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
});

// Add jobs to queue
export const processToQueue = async (
  accountId: string,
  eventId: string,
  data: any,
  destinations: any[]
) => {
  await dataQueue.add({
    accountId,
    eventId,
    data,
    destinations,
  });
};

// Process the jobs asynchronously
dataQueue.process(async (job) => {
  const { accountId, eventId, data, destinations } = job.data;

  for (const dest of destinations) {
    try {
      await axios({
        method: dest.httpMethod.toLowerCase(),
        url: dest.url,
        headers: dest.headers,
        ...(dest.httpMethod.toLowerCase() === "get" ||
        dest.httpMethod.toLowerCase() === "delete"
          ? { params: data } 
          : { data }),
      });

      await Log.create({
        eventId,
        accountId,
        destinationId: dest.id,
        receivedTimestamp: new Date(),
        processedTimestamp: new Date(),
        receivedData: JSON.stringify(data),
        status: "success",
      });
    } catch (error) {
      console.error("Error creating Log:", error);
      await Log.create({
        eventId,
        accountId,
        destinationId: dest.id,
        receivedTimestamp: new Date(),
        processedTimestamp: new Date(),
        receivedData: JSON.stringify(data),
        status: "failed",
      });
    }
  }
});

dataQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

dataQueue.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err}`);
});

export default dataQueue;
