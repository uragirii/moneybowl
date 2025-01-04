import Database, { type Database as IDatabase } from "better-sqlite3";
import fs from "fs";
import path from "path";
import { createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import stream from "stream";
import type { ReadableStream } from "stream/web";

/**
 * This file can run during build time or from CLI.
 */

const db = new Map<string, IDatabase>();
const downloadDatabase = async (database: string) => {
  const url = `${process.env.NEXT_PUBLIC_DATABASE_URL}/${database}.db`;
  const staticDir = path.resolve(".static");
  const filePath = path.resolve(staticDir, `${database}.db`);

  // Create .static directory if it doesn't exist
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    return;
  }

  console.log(`Downloading database: ${database}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download database: ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("Response body is empty");
  }

  const fileStream = fs.createWriteStream(filePath, { flags: "w" });
  const contentEncoding = response.headers.get("content-encoding");
  const nodeStream = stream.Readable.fromWeb(response.body as ReadableStream<Uint8Array>);

  if (contentEncoding === "br") {
    await pipeline(nodeStream, createBrotliDecompress(), fileStream);
  } else {
    await pipeline(nodeStream, fileStream);
  }

  console.log(`Downloaded database: ${database}`);
};

export const getDatabase = async (database: string) => {
  if (!db.has(database)) {
    db.set(database, new Database(path.resolve(".static", `${database}.db`)));
  }

  return db.get(database) as IDatabase;
};

// Run if this file is being executed directly
if (require.main === module) {
  const dbName = process.argv[2];
  if (!dbName) {
    console.error("Please provide a database name");
    process.exit(1);
  }
  
  downloadDatabase(dbName)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error downloading database:", error);
      process.exit(1);
    });
}
