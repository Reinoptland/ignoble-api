const app = require("../app");
const db = require("../models");

const request = require("supertest");

const server = request(app);

describe("GET /prizes/:id", () => {
  afterAll(async () => {
    await db.sequelize.close();
  });

  describe(" requesting one prize", () => {
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

    test("should get one prize by id", async (done) => {
      const prize = await db.Prize.findOne();
      const idToRequest = prize.id;

      const response = await server.get(`/prizes/${idToRequest}`);

      expect(response.status).toBe(200);
      done();
    });

    test("should only accept a valid id", async (done) => {
      const response = await server.get("/prizes/cheese");

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        'id must be a `number` type, but the final value was: `NaN` (cast from the value `"cheese"`).',
      ]);
      done();
    });

    test("should return a 404 when a prize with the requested id does not exist", async (done) => {
      const response = await server.get("/prizes/1000000");

      expect(response.status).toBe(404);
      expect(response.body).toEqual(null);
      done();
    });
  });
});
