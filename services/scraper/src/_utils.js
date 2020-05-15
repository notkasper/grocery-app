/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
const request = require('superagent');

const wait = async (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

const autoScroll = async (page) => {
  // Get the height of the rendered page
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(100);
    viewportIncr += viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(100);
};

const createPage = async (browser) => {
  const page = await browser.newPage();
  page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  );
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image') req.abort();
    else req.continue();
  });
  await page.authenticate({
    username: process.env.LUMINATI_USERNAME,
    password: process.env.LUMINATI_PASSWORD,
  });
  await page.setViewport({ width: 1366, height: 768 });
  return page;
};

const scrapeElementProperty = async (
  page,
  elementPath,
  property = 'textContent'
) => {
  const prop = await page
    .$(elementPath)
    .then((e) => (e ? e.getProperty(property) : null))
    .then((e) => (e ? e.jsonValue() : null))
    .then((e) => (e ? e.trim() : null));
  return prop;
};

const createProduct = async (product) => {
  await request.post(`api:${process.env.API_PORT}/products`).send({ product });
};

module.exports = {
  autoScroll,
  wait,
  createPage,
  scrapeElementProperty,
  createProduct,
};
