/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const uuid = require('uuid');
const { autoScroll } = require('./_utils');
const db = require('../models');

const scrapeAlbertHeijn = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.ah.nl/producten');

  const categoryOverviews = await page.$$('div.product-category-overview_category__E6EMG');
  for (const categoryOverview of categoryOverviews) {
    const categoryName = await categoryOverview
      .$('a.taxonomy-card_titleLink__1Dgai')
      .then((e) => e.getProperty('textContent'))
      .then((e) => e.jsonValue());
    const imageSrc = await categoryOverview
      .$('img.taxonomy-card_image__2W_2r')
      .then((e) => e.getProperty('src'))
      .then((e) => e.jsonValue());
    await db.Category.create({
      id: uuid.v4(),
      label: categoryName,
      image: imageSrc,
    });
    const categoryHref = await categoryOverview
      .$('a.taxonomy-card_titleLink__1Dgai')
      .then((e) => e.getProperty('href'))
      .then((e) => e.jsonValue());
    const categoryPage = await browser.newPage();
    await categoryPage.goto(`${categoryHref}?kenmerk=bonus&page=100`);
    await autoScroll(categoryPage);
    const bonusProducts = await categoryPage.$$('article');
    for (const product of bonusProducts) {
      const label = await product
        .$('span.line-clamp')
        .then((e) => e.getProperty('textContent'))
        .then((e) => e.jsonValue());
      const productImageSrc = await product
        .$('img')
        .then((e) => e.getProperty('src'))
        .then((e) => e.jsonValue());
      const amount = await product
        .$('span.price_unitSize__2pujV')
        .then((e) => e.getProperty('textContent'))
        .then((e) => e.jsonValue());
      const discountType = await product
        .$('span.shield_text__iFLQN')
        .then((e) => e.getProperty('textContent'))
        .then((e) => e.jsonValue());
      const availability = await product
        .$('p.smart-label_bonus__27_aC span.line-clamp')
        .then((e) => (e ? e.getProperty('textContent') : null))
        .then((e) => (e ? e.jsonValue() : null));
      const link = await product
        .$('div a.link_root__1r7dk')
        .then((e) => e.getProperty('href'))
        .then((e) => e.jsonValue());
      let newPrice = '';
      await product
        .$$('div.price-amount_root__2jJz9')
        .then((es) => (es.length > 1 ? es[1] : es[0]))
        .then((e) => (e ? e.$$('span') : null))
        .then(async (es) => {
          if (!es) return;
          for (const e of es) {
            const value = await e.getProperty('textContent').then((textContent) => textContent.jsonValue());
            newPrice = `${newPrice}${value}`;
          }
        });
      newPrice = Number.parseFloat(newPrice);
      let oldPrice = '';
      await product
        .$$('div.price-amount_root__2jJz9')
        .then((es) => (es.length > 1 ? es[0] : null))
        .then((e) => (e ? e.$$('span') : null))
        .then(async (es) => {
          if (!es) return;
          for (const e of es) {
            const value = await e.getProperty('textContent').then((textContent) => textContent.jsonValue());
            oldPrice = `${oldPrice}${value}`;
          }
        });
      newPrice = Number.parseFloat(newPrice);
      await db.Product.create({
        id: uuid.v4(),
        category: uuid.v4(), // TODO
        label,
        image: productImageSrc,
        amount,
        discount_type: discountType,
        availability,
        link,
        new_price: newPrice,
        discounted: true,
      });
    }
    await categoryPage.close();
  }

  await browser.close();
};

module.exports = scrapeAlbertHeijn;
