/* eslint-disable no-unused-vars */
require('dotenv').config();
const scrapeAlbertHeijn = require('./albertHeijn');
const scrapeJumbo = require('./jumbo');
const models = require('../models');

const run = async () => {
  await models.umzug.up();
  await scrapeJumbo();
  // await scrapeAlbertHeijn();
  models.sequelize.close();
};

run();
