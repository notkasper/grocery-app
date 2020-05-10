/* eslint-disable no-loop-func */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const ora = require('ora');
const puppeteer = require('puppeteer-extra');
const uuid = require('uuid');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const categoryMapper = require('./categoryMapper');
const { wait } = require('./_utils');
const db = require('../models');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

const scrapeJumbo = async () => {
  const errors = [];
  try {
    const spinner = ora('Starting Jumbo scraper...').start();
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    );
    page.on('error', (err) => {
      console.error('error: ', err);
    });

    page.on('pageerror', (pageerr) => {
      console.error('page error: ', pageerr);
    });
    await page.setViewport({ width: 1366, height: 768 });
    let response = await page.goto('https://www.jumbo.com/producten/?offSet=0&pageSize=25');
    while (response.status() === 403) {
      spinner.text = `Waiting to avoid rate-limit... [homepage]`;
      await wait(10 * 60 * 1000); // wait 10 minutes to avoid rate limit
      response = await page.goto('https://www.jumbo.com/producten/?offSet=0&pageSize=25');
    }

    await wait(1000);
    const categoryList = await page.$$('ul.filter-group');
    const categoryLinks = await categoryList[0].$$('li a');
    let catCounter = 0;
    let productCounter = 0;
    for (const categoryLink of categoryLinks) {
      catCounter += 1;
      const [categoryName, categoryCount] = await categoryLink
        .$$('span')
        .then(async ([e1, e2]) => [await e1.getProperty('textContent'), await e2.getProperty('textContent')])
        .then(async ([e1, e2]) => [await e1.jsonValue(), await e2.jsonValue()])
        .then(([e1, e2]) => [e1, Number.parseInt(e2.slice(1, e2.length - 1), 10)]);
      const categoryPage = await browser.newPage();
      await categoryPage.setViewport({ width: 1366, height: 768 });
      const pageSize = 25;
      for (let offset = 0; offset < categoryCount; offset += pageSize) {
        const spinnerText = `category ${catCounter}/${categoryLinks.length} | page ${offset / pageSize}/${Math.ceil(
          categoryCount / pageSize
        )} | products created: ${productCounter}`;
        const categoryPageUrl = `https://www.jumbo.com/producten/categorieen/${categoryName
          .split(' ')
          .join('-')
          .toLowerCase()}/?offSet=${offset}&pageSize=${pageSize}`;
        response = await categoryPage.goto(categoryPageUrl);
        while (response.status() === 403) {
          spinner.text = `Waiting to avoid rate-limit... ${spinnerText}`;
          await wait(10 * 60 * 1000); // wait 10 minutes to avoid rate limit
          response = await categoryPage.goto(categoryPageUrl);
        }
        spinner.text = spinnerText;
        await wait(1000);
        const products = await categoryPage.$$('div.jum-card-grid div.jum-card');
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
              const newPrice = await product.$$('span.jum-product-price__current-price span').then(async ([e1, e2]) => {
                const euros = await e1.getProperty('textContent').then((e) => e.jsonValue());
                const cents = await e2.getProperty('textContent').then((e) => e.jsonValue());
                return Number.parseFloat(`${euros}.${cents}`);
              });
              if (discountType) {
                const scrapePage = async () => {
                  const productPage = await browser.newPage();
                  await productPage.setViewport({ width: 1366, height: 768 });
                  await productPage.goto(link);
                  const availability = await productPage
                    .$('div.promotion-disclaimer h6')
                    .then((e) => (e ? e.getProperty('textContent') : null))
                    .then((e) => (e ? e.jsonValue() : null));
                  await productPage.close();

                  let tillDay;
                  let tillMonth;
                  let fromDay;
                  let fromMonth;
                  try {
                    const [from, till] = availability.substring(25, 40).split(' t/m ');
                    [fromDay, fromMonth] = from.split('-');
                    [tillDay, tillMonth] = till.split('-');
                  } catch (error) {
                    errors.push({ message: `could not find availability for: ${link}`, error });
                  }

                  const year = new Date().getFullYear();

                  let availabilityFrom = null;
                  if (fromDay && fromMonth) {
                    availabilityFrom = new Date(year, fromMonth, fromDay);
                  }

                  let availabilityTill = null;
                  if (tillDay && tillMonth) {
                    availabilityTill = new Date(year, tillMonth, tillDay);
                  }

                  await db.Product.create({
                    id: uuid.v4(),
                    category: categoryMapper.jumbo[categoryName],
                    label: label.substring(0, 1000),
                    image: productImageSrc.substring(0, 1000),
                    amount,
                    discount_type: discountType,
                    availability_from: availabilityFrom,
                    availability_till: availabilityTill,
                    store_name: 'jumbo',
                    link: link.substring(0, 10000),
                    new_price: newPrice,
                    discounted: true,
                  });
                  productCounter += 1;
                };
                scrapePage();
              }
            }
          } catch (error) {
            errors.push({ messsage: `Error while scraping product\n${error}`, error });
          }
        }
      }
      await categoryPage.close();
    }
    await browser.close();
  } catch (error) {
    errors.push({ message: 'Jumbo scraper crashed...', error });
  }
  console.error(errors);
};

module.exports = scrapeJumbo;
