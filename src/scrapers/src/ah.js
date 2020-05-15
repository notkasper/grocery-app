/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { createPage, wait } = require('./_utils');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

const scrapeAlbertHeijn = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      //   `--proxy-server=${process.env.LUMINATI_PROXY_IP}`,
    ],
  });
  const page = await createPage(browser);
  await page.goto('https://www.ah.nl/producten');

  const categoryOverviews = await page.$$(
    'div.product-category-overview_category__E6EMG'
  );

  console.info(`LENGTH: ${categoryOverviews.length}`);
  console.info(`LENGTH: ${categoryOverviews.length}`);
  console.info(`LENGTH: ${categoryOverviews.length}`);
  console.info(`LENGTH: ${categoryOverviews.length}`);
  console.info(`LENGTH: ${categoryOverviews.length}`);

  await wait(5000);

  await browser.close();
};

module.exports = scrapeAlbertHeijn;
