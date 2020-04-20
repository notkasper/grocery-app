// const scrapeAlbertHeijn = require('./albertHeijn');
const scrapeJumbo = require('./jumbo');

const run = async () => {
  //   await scrapeAlbertHeijn();
  await scrapeJumbo();
};

run();
