import redis from "../config/redis.config";

const DEFAULT_TTL = 300; 

export const setCache = async (key: string, data: any, ttl = DEFAULT_TTL) => {
  await redis.set(key, JSON.stringify(data), "EX", ttl);
};

export const getCache = async (key: string): Promise<any | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};
