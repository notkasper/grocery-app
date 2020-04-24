/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const uuid = require('uuid');
const { wait } = require('./_utils');
const db = require('../models');

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
      .then(async ([e1, e2]) => [
        await e1.getProperty('textContent'),
        await e2.getProperty('textContent'),
      ])
      .then(async ([e1, e2]) => [await e1.jsonValue(), await e2.jsonValue()])
      .then(([e1, e2]) => [
        e1,
        Number.parseInt(e2.slice(1, e2.length - 1), 10),
      ]);
    const categoryPage = await browser.newPage();
    await categoryPage.setViewport({ width: 1366, height: 768 });
    const pageSize = 25;
    for (let offset = 0; offset < categoryCount; offset += pageSize) {
      await categoryPage.goto(
        `${baseUrl}/categorieen/${categoryName}?offSet=${offset}&pageSize=${pageSize}`
      );
      await wait(2000);
      // TODO: Hardcoded wait for products to load, find a better way to do this
      const products = await categoryPage.$$('div.jum-card-grid div.jum-card');
      const productPromises = [];
      for (const product of products) {
        try {
          const banner = await product.$('div.banner-content');
          if (!banner) {
            const label = await product
              .$('h3.jum-card-title__text span')
              .then((e) => e.getProperty('textContent'))
              .then((e) => e.jsonValue());
            const productImageSrc = await product
              .$('img')
              .then((e) => e.getProperty('src'))
              .then((e) => e.jsonValue());
            const amount = await product
              .$('h4')
              .then((e) => (e ? e.getProperty('textContent') : null))
              .then((e) => (e ? e.jsonValue() : null));
            const discountType = await product
              .$('ul.jum-tag-list li span')
              .then((e) => (e ? e.getProperty('textContent') : null))
              .then((e) => (e ? e.jsonValue() : null))
              .then((e) => (e ? e.trim() : null));
            const link = await product
              .$('a')
              .then((e) => (e ? e.getProperty('href') : null))
              .then((e) => (e ? e.jsonValue() : null));
            const newPrice = await product
              .$$('span.jum-product-price__current-price span')
              .then(async ([e1, e2]) => {
                const euros = await e1
                  .getProperty('textContent')
                  .then((e) => e.jsonValue());
                const cents = await e2
                  .getProperty('textContent')
                  .then((e) => e.jsonValue());
                return Number.parseFloat(`${euros}.${cents}`);
              });
            if (discountType) {
              const productPage = await browser.newPage();
              await productPage.setViewport({ width: 1366, height: 768 });
              await productPage.goto(link);
              const availability = await productPage
                .$('div.jum-promotion-date div')
                .then((e) => (e ? e.getProperty('textContent') : null))
                .then((e) => (e ? e.jsonValue() : null));
              await productPage.close();

              const year = new Date().getFullYear();
              const [fromDay, fromMonth] = availability
                .substring(9, 14)
                .split('-');
              const [tillDay, tillMonth] = availability
                .substring(17, 22)
                .split('-');

              const availabilityFrom = new Date(year, fromMonth, fromDay);
              const availabilityTill = new Date(year, tillMonth, tillDay);

              productPromises.push(
                db.Product.create({
                  id: uuid.v4(),
                  category: uuid.v4(), // TODO
                  label: label.substring(0, 250),
                  image: productImageSrc,
                  amount,
                  discount_type: discountType,
                  availability_from: availabilityFrom,
                  availability_till: availabilityTill,
                  link,
                  new_price: newPrice,
                  discounted: true,
                })
              );
            }
          }
        } catch (error) {
          console.error(`Error while scraping product\n${error}`);
        }
      }
      await Promise.all(productPromises);
    }
    await categoryPage.close();
  }
  await browser.close();
};

module.exports = scrapeJumbo;
