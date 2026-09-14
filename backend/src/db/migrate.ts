import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "./index.js";

const here = dirname(fileURLToPath(import.meta.url));

function findMigrationsFolder() {
    const candidates = [
        resolve(here, "migrations"),
        resolve(here, "../../src/db/migrations"),
        resolve(process.cwd(), "backend/src/db/migrations"),
        resolve(process.cwd(), "src/db/migrations"),
    ];
    return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export async function applyMigrations() {
    const migrationsFolder = findMigrationsFolder();
    if (!migrationsFolder) {
        throw new Error("Could not locate the drizzle migrations folder.");
    }
    console.log(`[db] Applying migrations from ${migrationsFolder} …`);
    await migrate(db, { migrationsFolder });
    console.log("[db] Migrations are up to date.");
}