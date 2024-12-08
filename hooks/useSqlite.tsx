"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import sqlite3InitModule, {
  type Database,
  type SqlValue,
} from "@sqlite.org/sqlite-wasm";

export interface TableMetadata {
  name: string;
  columns: string[];
}

const SQLiteContext = createContext<
  | {
      runQuery: (query: string) => Promise<SqlValue[][]>;
      loadingProgress: number;
      getTableMetadata: () => Promise<TableMetadata[]>;
    }
  | undefined
>(undefined);

let sqlite3: any;

sqlite3InitModule().then((sqlite) => {
  sqlite3 = sqlite;
});

async function downloadWithProgress(
  url: string,
  onProgress: (progress: number) => void,
): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: {
      "Accept-Encoding": "br",
    },
  });
  const contentLength =
    Number(
      response.headers.get("x-file-size") ??
        response.headers.get("Content-Length"),
    ) || 0;
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Failed to get response reader");

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.byteLength;
    onProgress(Math.min((receivedLength / contentLength) * 100, 100));
  }

  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  const brotliPromise = await import("brotli-dec-wasm");
  const brotli = await brotliPromise.default;
  return brotli.decompress(allChunks);
}

export function SQLiteProvider({
  children,
  dbUrl,
}: {
  children: React.ReactNode;
  dbUrl: string;
}) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const dbRef = useRef<Database | null>(null);

  useEffect(() => {
    const initDb = async (dbUrl: string) => {
      const buffer = await downloadWithProgress(dbUrl, setLoadingProgress);
      const p = sqlite3.wasm.allocFromTypedArray(buffer);
      const db = new sqlite3.oo1.DB("") as Database;
      const rc = sqlite3.capi.sqlite3_deserialize(
        db.pointer!,
        "main",
        p,
        buffer.byteLength,
        buffer.byteLength,
        sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE,
        // Optionally:
        // | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
      );
      db.checkRc(rc);
      db.exec({
        sql: "SELECT count(*) FROM matches",
        callback: (row) => {
          console.log(row);
        },
      });
      return db;
    };

    initDb(dbUrl).then((database) => {
      dbRef.current = database;
    });
  }, [dbUrl]);

  const runQuery = async (query: string) => {
    return new Promise<SqlValue[][]>(async (resolve, reject) => {
      const db = dbRef.current;
      if (!db) {
        reject("Database not ready");
        return;
      }
      const columnNames = [] as string[];
      const rows: SqlValue[] = [];
      try {
        // Add LIMIT 100 to the query if it doesn't already have a LIMIT clause
        query = query.endsWith(";") ? query.slice(0, -1) : query;
        const limitedQuery = query.toLowerCase().includes("limit")
          ? query
          : `${query} LIMIT 25;`;
        console.log("query", limitedQuery);

        db.exec({
          sql: limitedQuery,
          callback: (row) => {
            rows.push(...row);
          },
          columnNames,
          rowMode: "array", // ensures consistent row format
        });

        // Group rows into table
        const columnsCount = columnNames.length;
        const rowsCount = rows.length / columnsCount;
        const table = [columnNames] as SqlValue[][];
        for (let i = 0; i < rowsCount; i++) {
          const row = [] as SqlValue[];
          for (let j = 0; j < columnsCount; j++) {
            row.push(rows[i * columnsCount + j]);
          }
          table.push(row);
        }
        resolve(table);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Function to get table metadata
  const getTableMetadata = async (): Promise<TableMetadata[]> => {
    const db = dbRef.current;
    if (!db) {
      throw "Database not ready";
    }
    const tables: TableMetadata[] = [];

    // Get all tables
    const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table'";
    db.exec({
      sql: tablesQuery,
      callback: (row) => {
        const tableName = row[0] as string;

        // Get columns for each table
        db.exec({
          sql: `PRAGMA table_info(${tableName})`,
          callback: (columnRow) => {
            if (!tables.find((t) => t.name === tableName)) {
              tables.push({ name: tableName, columns: [] });
            }
            const table = tables.find((t) => t.name === tableName)!;
            table.columns.push(columnRow[1] as string);
          },
        });
      },
    });

    return tables;
  };

  return (
    <SQLiteContext.Provider
      value={{ runQuery, loadingProgress, getTableMetadata }}
    >
      {children}
    </SQLiteContext.Provider>
  );
}

export function useSQLite() {
  const context = useContext(SQLiteContext);
  if (!context) {
    throw new Error("useSQLite must be used within a SQLiteProvider");
  }
  return context;
}
