import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL環境変数が設定されていません。");
}

const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle({ client, schema });
