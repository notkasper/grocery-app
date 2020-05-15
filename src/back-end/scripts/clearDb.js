/* eslint-disable no-unused-vars */
require('dotenv').config();
const db = require('../models');

const run = async () => {
  await db.umzug.up();
  await db.Product.destroy({ where: {} });
  db.sequelize.close();
};

run();
