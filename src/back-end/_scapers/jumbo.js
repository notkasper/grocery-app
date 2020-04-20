/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const { wait } = require('./_utils');

const scrapeJumbo = async () => {
  const baseUrl = 'https://www.jumbo.com/producten';
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--start-maximized', // you can also use '--start-fullscreen'
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(baseUrl);

  await wait(1000);
  const categoryList = await page.$$('ul.filter-group');
  const categoryLinks = await categoryList[0].$$('li a');
  for (const categoryLink of categoryLinks) {
    const [categoryName, categoryCount] = await categoryLink
      .$$('span')
      .then(async ([e1, e2]) => [await e1.getProperty('textContent'), await e2.getProperty('textContent')])
      .then(async ([e1, e2]) => [await e1.jsonValue(), await e2.jsonValue()])
      .then(([e1, e2]) => [e1, Number.parseInt(e2.slice(1, e2.length - 1), 10)]);

    const categoryPage = await browser.newPage();
    const pageSize = 25;
    let offset = 0;
    for (offset; offset < Math.ceil(categoryCount / pageSize); offset += pageSize) {
      await categoryPage.goto(`${baseUrl}/categorieen/${categoryName}?offset=${offset}&pageSize=${pageSize}`);
      await wait(2000);
      // TODO: Hardcoded wait for products to load, find a better way to do this
      const products = await categoryPage.$$('div.jum-card-grid div.jum-card');
      for (const product of products) {
        const banner = await product.$('div.banner-content');
        if (!banner) {
          const productName = await product
            .$('h3.jum-card-title__text span')
            .then((e) => e.getProperty('textContent'))
            .then((e) => e.jsonValue());
          const productImageSrc = await product
            .$('img')
            .then((e) => e.getProperty('src'))
            .then((e) => e.jsonValue());
          const amount = await product
            .$('h4')
            .then((e) => e.getProperty('textContent'))
            .then((e) => e.jsonValue());
          // const discountType = await product
          //   .$("span.shield_text__iFLQN")
          //   .then(e => e.getProperty("textContent"))
          //   .then(e => e.jsonValue());
          // const availability = await product
          //   .$("p.smart-label_bonus__27_aC span.line-clamp")
          //   .then(e => (e ? e.getProperty("textContent") : null))
          //   .then(e => (e ? e.jsonValue() : null));
          const link = await product
            .$('a')
            .then((e) => e.getProperty('href'))
            .then((e) => e.jsonValue());
          const newPrice = await product.$$('span.jum-product-price__current-price span').then(async ([e1, e2]) => {
            const euros = await e1.getProperty('textContent').then((e) => e.jsonValue());
            const cents = await e2.getProperty('textContent').then((e) => e.jsonValue());
            return Number.parseFloat(`${euros}.${cents}`);
          });
          console.info({
            categoryName,
            productName,
            productImageSrc,
            amount,
            link,
            newPrice,
          });
        }
      }
    }
  }
};

module.exports = scrapeJumbo;
