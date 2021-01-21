const { expect } = require("@jest/globals");
const { formatQuery, validateQuery } = require("./queries");

test("should format a query so it can be passed to sequelize", () => {
  const query = { year: 2020, limit: 10 };
  const searchAbleProperties = ["year", "type"];
  const formattedQuery = formatQuery(query, searchAbleProperties);

  expect(formattedQuery).toEqual({ year: 2020 });
});

test("should validate and return a formatted query", () => {
  const query = { year: 2020, limit: 10 };
  const permittedParameters = ["year", "type", "limit", "offset"];
  const searchAbleProperties = ["year", "type"];

  const [validatedQuery, error] = validateQuery(
    query,
    permittedParameters,
    searchAbleProperties
  );

  expect(validatedQuery).toEqual({ year: 2020 });
  expect(error).toBe(null);
});

test("should validate and produce an error for bad queries", () => {
  const query = { bla: "cheese", limit: 10 };
  const permittedParameters = ["year", "type", "limit", "offset"];
  const searchAbleProperties = ["year", "type"];

  const [validatedQuery, error] = validateQuery(
    query,
    permittedParameters,
    searchAbleProperties
  );

  expect(validatedQuery).toEqual(null);
  expect(error).toBe(
    "Invalid parameter, acceptable parameters are: year, type, limit, offset"
  );
});
