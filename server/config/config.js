require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
    dialect: "postgres",
    pool: {
      // When seeding parrallel, we are getting max connection errors
      // So for now we set the max connections to max - 1 (so 5 - 1 -> 4)
      max: 4,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    use_env_variable: "PRODUCTION_DATABASE_URL",
    dialect: "postgres",
    pool: {
      // When seeding parrallel, we are getting max connection errors
      // So for now we set the max connections to max - 1 (so 5 - 1 -> 4)
      max: 4,
    },
  },
};
