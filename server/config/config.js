require("dotenv").config();
// var pg = require("pg");
// pg.defaults.ssl = true;

module.exports = {
  development: {
    use_env_variable: "DEV_DATABASE_URL",
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: true,
    //   falserejectUnauthorized: false,
    // },
    pool: {
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
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
