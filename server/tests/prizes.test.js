const app = require("../app");

const request = require("supertest");

test("should try", () => {
  const what = request(app).get("/prizes");
  console.log(what);

  expect(what).toBeDefined();
});
