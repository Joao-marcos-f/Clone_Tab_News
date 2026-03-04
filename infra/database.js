import { Client } from "pg";

async function query(queryobject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryobject);
    return result;
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    await client.end();
  }
}
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLconfig(),
  });
  await client.connect();
  return client;
}

function getSSLconfig() {
  return process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false, require: true }
    : false;
}

export default {
  query,
  getNewClient,
};
