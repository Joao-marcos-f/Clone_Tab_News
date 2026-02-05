import { Client } from "pg";

async function query(queryobject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl:
      process.env.NODE_ENV !== "development"
        ? true
        : { rejectUnauthorized: false, require: false },
  });

  try {
    await client.connect();
    const result = await client.query(queryobject);
    return result;
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    await client.end();
  }
}
export default {
  query: query,
};
