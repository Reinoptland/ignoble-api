const app = require("../app");
const db = require("../models");

const request = require("supertest");

const server = request(app);

afterAll(async () => {
  await db.Prize.destroy({ truncate: true, cascade: true });
  await db.sequelize.close();
});

beforeAll(async () => {
  await db.Prize.destroy({ truncate: true, cascade: true });
  const testData = [
    {
      year: 2020,
      type: "ACOUSTICS",
      description:
        "Inducing a female Chinese alligator to bellow in an airtight chamber filled with helium-enriched air.",
    },
    {
      year: 2020,
      type: "PSYCHOLOGY",
      description:
        "Devising a method to identify narcissists by examining their eyebrows.",
    },
    {
      year: 2020,
      type: "PEACE",
      description:
        "Having their diplomats surreptitiously ring each other’s doorbells in the middle of the night, and then run away before anyone had a chance to answer the door.",
    },
  ];

  await db.Prize.bulkCreate(testData);
});

test("should try", async (done) => {
  const response = await server.get("/prizes");

  expect(response.status).toBe(200);
  expect(response.body.length).toStrictEqual(3);
  expect(response.body[0].type).toBe("ACOUSTICS");
  done();
});
