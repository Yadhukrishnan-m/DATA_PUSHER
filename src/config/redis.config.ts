import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
});

redis.on("connect", () => console.log(" Redis connected to remote server"));
redis.on("error", (err) => console.error(" Redis error:", err));

export default redis;
