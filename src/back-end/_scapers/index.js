/* eslint-disable no-unused-vars */
const scrapeAlbertHeijn = require('./albertHeijn');
const scrapeJumbo = require('./jumbo');
// const models = require('../models');

const run = async () => {
  // await models.umzug.up();
  await scrapeJumbo();
  await scrapeAlbertHeijn();
  // models.sequelize.close();
};

run();
