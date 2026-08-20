import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const backendDir = new URL(".", import.meta.url);
dotenv.config({ path: fileURLToPath(new URL("./.env", backendDir)) });

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/boardnotes",
    },
    verbose: true,
    strict: true,
} satisfies Config;
