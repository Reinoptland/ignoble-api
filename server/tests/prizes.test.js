const app = require("../app");
const db = require("../models");

const request = require("supertest");
const { expect } = require("@jest/globals");

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
      year: 2019,
      type: "PSYCHOLOGY",
      description:
        "Devising a method to identify narcissists by examining their eyebrows.",
    },
    {
      year: 2018,
      type: "PEACE",
      description:
        "Having their diplomats surreptitiously ring each other’s doorbells in the middle of the night, and then run away before anyone had a chance to answer the door.",
    },
  ];

  await db.Prize.bulkCreate(testData);
});

test("should respond with prizes as json", async (done) => {
  const response = await server.get("/prizes");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(3);
  expect(response.body[0].type).toBe("ACOUSTICS");
  done();
});

test("should accept a type parameter for the type of prize", async (done) => {
  const response = await server.get("/prizes?type=PEACE");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

test("should accept a year parameter for the year of the prize", async (done) => {
  const response = await server.get("/prizes?year=2018");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

test("should not accept parameters other than type or year", async (done) => {
  const response = await server.get("/prizes?user=Rein");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "Invalid parameter, acceptable parameters are: type, year"
  );
  done();
});

test("should set status 404 if when there are no results for a query", async (done) => {
  const response = await server.get("/prizes?type=TEST");

  expect(response.status).toBe(404);
  expect(response.body.length).toBe(0);
  done();
});
