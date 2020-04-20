const scrapeAlbertHeijn = require('./albertHeijn');
const models = require('../models');
// const scrapeJumbo = require('./jumbo');

const run = async () => {
  await models.umzug.up();
  await scrapeAlbertHeijn();
  // await scrapeJumbo();
};

run();
