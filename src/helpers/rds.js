const AWS = require("aws-sdk");
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_APP,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_APP,
  },
  region: process.env.AWS_REGION_APP,
});
const moment = require("moment");

const Knex = require("knex");

class Rds {
  constructor(accountName) {
    this.isReady = false;
    accountName = accountName.toLowerCase();
    this.tables = {};
    this.tableColumns = {};
    this.pendingTableReviews = [];
    this.data = require("data-api-client")({
      region: "us-east-1",
      secretArn: `arn:aws:secretsmanager:us-east-1:637311199472:secret:secret-${accountName.toLowerCase()}`,
      resourceArn: `arn:aws:rds:us-east-1:637311199472:cluster:${accountName.toLowerCase()}`,
      database: "master", // default database
    });
    this.knex = Knex({ client: "pg" });
  }

  testReady = async function () {
    let ready = false;
    try {
      const sql = `select * from information_schema.tables where table_schema='public' limit 1;`;
      let result = await this.data.query(sql);
      ready = true;
    } catch (e) {
      console.log(e);
      throw e;
    }

    return ready;
  };

  ready = async function (tableName) {
    let isReady = false;
    while (!isReady) {
      isReady = await this.testReady();
      if (!isReady) await new Promise((r) => setTimeout(r, 10000));
    }
    this.isReady = true;
    return true;
  };

  execute = async function (_knex) {
    if (!this.isReady) await this.ready();
    const sql = typeof _knex.sql == "string" ? _knex : _knex.toSQL();
    let response = await this.data.query(
      toNamedString(sql.sql),
      toNamedParams(sql.bindings)
    );
    return response.records;
  };

  registerTable = async function (tableName, sample) {
    await this.loadTable(tableName);
    await this.loadColumns(tableName, sample);
  };

  loadTable = async function (tableName) {
    const sql = `select * from information_schema.tables where table_schema='public';`;
    let result = await this.data.query(sql);
    const tableMap = {};
    result.records.forEach((item) => {
      tableMap[item.table_name] = tableName;
    });

    if (!tableMap[tableName])
      await this.data.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY);`);
  };

  loadColumns = async function (tableName, sample) {
    const sql = `select * from information_schema.columns where table_schema='public' and table_name = '${tableName}';`;
    let result = await this.data.query(sql);

    const tableMap = {};
    result.records.forEach((item) => {
      let table = tableMap[item.table_name] || {
        name: item.table_name,
        columnMap: {},
      };
      table.columnMap[item.column_name] = item;
      tableMap[item.table_name] = table;
    });
    this.tableColumns = tableMap;

    const sampleKeys = Object.keys(sample);
    for (let index = 0; index < sampleKeys.length; index++) {
      const key = sampleKeys[index];
      if (!this.tableColumns[tableName].columnMap[key])
        await this.migrateColumn(tableName, key, sample[key]);
    }
  };

  migrateColumn = async function (tableName, columnName, columnValue) {
    let type = "text";
    if (columnName.indexOf("Id") > -1 || columnName.indexOf("_id") > -1) {
      columnName = columnName.replace("Id", "_id");
      type = "integer";
    } else if (typeof columnValue == "number") type = "decimal(14,2)";
    else if (typeof columnValue == "boolean") type = "boolean";
    else if (columnValue instanceof Date) {
      type = "timestamp with time zone";
    }

    await this.data.query(
      `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${type};`
    );

    if (columnName == "external_id")
      await this.data.query(
        `ALTER TABLE ${tableName} ADD UNIQUE (${columnName});`
      );

    this.tableColumns[tableName].columnMap[columnName] = {
      type: type,
      name: columnName,
    };
  };
}

function toNamedString(str) {
  let index = 1;
  while (str.indexOf("?") > -1) {
    str = str.replace("?", `:p${index}`);
    index++;
  }

  return str;
}

function toNamedParams(arr) {
  if (!arr) return [];
  let map = {};
  arr.forEach((item, index) => {
    map[`p${index + 1}`] = item;
  });
  return map;
}

module.exports = Rds;
