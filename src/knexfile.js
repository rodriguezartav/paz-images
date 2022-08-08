const { loadEnvConfig } = require("@next/env");
const dev = process.env.NODE_ENV !== "production";

var moment = require("moment");

let pg = require("pg");

const { PG_URI } = loadEnvConfig("./", dev).combinedEnv;

pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
  return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.INT2, (value) => {
  return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.INT4, (value) => {
  return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT4, (value) => {
  return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value) => {
  return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

const parsePgConnStr = require("pg-connection-string").parse;

module.exports = {
  development: {
    client: "pg",

    connection: {
      ...parsePgConnStr(PG_URI),
      dialectOptions: {
        ssl: {
          require: true,
          // Ref.: https://github.com/brianc/node-postgres/issues/2009
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: { rejectUnauthorized: false, required: true },
    },
  },
  production: {
    client: "pg",
    pool: { min: 1, max: 8 },
    connection: {
      ...parsePgConnStr(PG_URI),
      dialectOptions: {
        ssl: {
          require: true,
          // Ref.: https://github.com/brianc/node-postgres/issues/2009
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      max: 15,
      ssl: { rejectUnauthorized: false, required: true },
    },
  },
};
