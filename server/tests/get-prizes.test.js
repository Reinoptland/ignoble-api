const app = require("../app");
const db = require("../models");

const request = require("supertest");

const server = request(app);

describe("GET /prizes", () => {
  afterAll(async () => {
    await db.sequelize.close();
  });

  describe(" query string options", () => {
    afterAll(async () => {
      await db.Prize.destroy({ truncate: true, cascade: true });
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

    test("should respond with prizes as json without a querystring", async (done) => {
      const response = await server.get("/prizes");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.prizes[0].type).toBe("ACOUSTICS");
      done();
    });

    test("should accept a type parameter for the type of prize", async (done) => {
      const response = await server.get("/prizes?type=PEACE");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      done();
    });

    test("should accept a year parameter for the year of the prize", async (done) => {
      const response = await server.get("/prizes?year=2018");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      done();
    });

    test("should not accept parameters other than type or year", async (done) => {
      const response = await server.get("/prizes?user=Rein");

      expect(response.status).toBe(200);
      done();
    });

    test.todo(
      "should produce a readable error when an unrecognized parameter is used"
    );

    test("should set status 404 if when there are no results for a query", async (done) => {
      const response = await server.get("/prizes?type=TEST");

      expect(response.status).toBe(404);
      expect(response.body.count).toBe(0);
      done();
    });
  });

  describe(" pagination", () => {
    afterAll(async () => {
      await db.Prize.destroy({ truncate: true, cascade: true });
    });

    beforeAll(async () => {
      await db.Prize.destroy({ truncate: true, cascade: true });

      const testData = [];

      for (let index = 0; index < 25; index++) {
        testData.push({
          year: 1991 + index,
          type: "TEST",
          description: "prize" + index,
        });
      }

      await db.Prize.bulkCreate(testData);
    });

    test("should paginate by 20 by default", async (done) => {
      const response = await server.get("/prizes");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(25);
      expect(response.body.prizes.length).toBe(20);
      done();
    });

    test("should accept a limit parameter", async (done) => {
      const response = await server.get("/prizes?limit=10");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(25);
      expect(response.body.prizes.length).toBe(10);
      done();
    });

    test("should get the max amount in case the limit is too high", async (done) => {
      const response = await server.get("/prizes?limit=100");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(25);
      expect(response.body.prizes.length).toBe(25);
      done();
    });

    test("should accept an offset parameter", async (done) => {
      const response = await server.get("/prizes?offset=2&limit=20");

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(25);
      expect(response.body.prizes.length).toBe(20);
      expect(response.body.prizes[0].description).toBe("prize2");
      done();
    });

    test("the value of the limit and offset parameter should not be a negative number", async (done) => {
      const response = await server.get("/prizes?offset=-1&limit=-1");

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        "limit must be greater than or equal to 1",
        "offset must be greater than or equal to 0",
      ]);
      done();
    });
    test("the value of the limit and offset parameter should not be a string of characters", async (done) => {
      const response = await server.get("/prizes?offset=one&limit=two");

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        'limit must be a `number` type, but the final value was: `NaN` (cast from the value `"two"`).',
        'offset must be a `number` type, but the final value was: `NaN` (cast from the value `"one"`).',
      ]);
      done();
    });
  });
});
