import database from "infra/database.js";
// API endpoint to get the status of the application and Postgres database
async function status(req, res) {
  // Record the time of the status check
  const updateAt = new Date().toISOString();
  // Initialize variables to hold Postgres info
  try {
    // Fetch Postgres version
    const result = await database.query("SHOW server_version;");
    const row = result && result.rows && result.rows[0];
    const pgVersion = row && (row.server_version || Object.values(row)[0]);
    // Fetch max_connections
    const maxConnections = await database.query("SHOW max_connections;");
    const maxConnRow =
      maxConnections && maxConnections.rows && maxConnections.rows[0];
    const maxConnValue =
      maxConnRow &&
      (maxConnRow.max_connections || Object.values(maxConnRow)[0]);

    // Fetch total active connections
    const databaseName = process.env.POSTGRES_DB;
    const total_connections = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const totalConnRow =
      total_connections && total_connections.rows && total_connections.rows[0];
    const totalConnValue =
      totalConnRow && (totalConnRow.count || Object.values(totalConnRow)[0]);

    return res.status(200).json({
      update_at: updateAt,
      dependecies: {
        database: {
          postgres_version: pgVersion || null,
          max_connections: parseInt(maxConnValue) || null,
          total_connections: totalConnValue || null,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      update_at: updateAt,
      error: "unable to fetch database status",
    });
  }
}

export default status;
