import fs from "fs/promises";
import path from "path";

const cacheFile = path.join(process.cwd(), "streamCache.json");

export const getCachedStream = async (
  movieId: number
): Promise<string | null> => {
  try {
    const data = await fs.readFile(cacheFile, "utf-8");
    const cache = JSON.parse(data);
    return cache[movieId] || null;
  } catch {
    return null;
  }
};

export const setCachedStream = async (movieId: number, url: string) => {
  try {
    let cache = [];
    try {
      const data = await fs.readFile(cacheFile, "utf-8");
      cache = JSON.parse(data);
    } catch {}
    cache[movieId] = url;
    await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Cache Error:", error);
  }
};
