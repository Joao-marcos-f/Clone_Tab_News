import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const dbclient = await database.getNewClient();
  const defaultmigrationRunnerOptions = {
    dbClient: dbclient,
    dir: join("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
    noLock: true,
  };

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultmigrationRunnerOptions,
      dryRun: false,
    });
    await dbclient.end();
    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }
    return res.status(200).json(migratedMigrations);
  }
  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner(
      defaultmigrationRunnerOptions,
    );
    await dbclient.end();
    return res.status(200).json(pendingMigrations);
  }

  return res.status(405).end(); // Method Not Allowed
}
