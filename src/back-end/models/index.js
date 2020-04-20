require('dotenv').config(); // initialize environment variables
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});

sequelize.authenticate().catch((error) => console.error(chalk.red.bold(error)));

db.umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, './migrations'),
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface()],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
});

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
