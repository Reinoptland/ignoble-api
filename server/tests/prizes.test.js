const app = require("../app");
const db = require("../models");

const request = require("supertest");

const server = request(app);

afterAll(async () => {
  await db.sequelize.close();
});

test("should try", async (done) => {
  const response = await server.get("/prizes");
  console.log(response);

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual([]);
  done();
});
