test("GET to /api/v1/status should return 200", async () => {
  const res = await fetch("http://localhost:3000/api/v1/status");
  expect(res.status).toBe(200);

  const resbody = await res.json();
  console.log(resbody);
  expect(resbody.update_at).toBeDefined();

  expect(resbody.dependecies.database.postgres_version).toBeDefined();

  expect(resbody.dependecies.database.max_connections).toBeDefined();
  expect(resbody.dependecies.database.max_connections).toBe(100);

  expect(resbody.dependecies.database.total_connections).toBeDefined();
  expect(resbody.dependecies.database.total_connections).toBe(1);
});
