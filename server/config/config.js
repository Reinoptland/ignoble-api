require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
    dialect: "postgres",
    pool: {
      // When seeding parrallel, we are getting max connection errors, due to postico taking up 1 connection
      // So for now we set the max connections to max - 1 (so 5 - 1 -> 4)
      max: 4,
    },
  },
  test: {
    use_env_variable: "TEST_DATABASE_URL",
    dialect: "postgres",
    pool: {
      // When seeding parrallel, we are getting max connection errors, due to postico taking up 1 connection
      // So for now we set the max connections to max - 1 (so 5 - 1 -> 4)
      max: 4,
    },
  },
  production: {
    use_env_variable: "PRODUCTION_DATABASE_URL",
    dialect: "postgres",
    pool: {
      // When seeding parrallel, we are getting max connection errors, due to postico taking up 1 connection
      // So for now we set the max connections to max - 1 (so 5 - 1 -> 4)
      max: 4,
    },
  },
};
