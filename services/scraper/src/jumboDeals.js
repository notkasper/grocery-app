/* eslint-disable no-loop-func */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const ora = require('ora');
const puppeteer = require('puppeteer-extra');
const uuid = require('uuid');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { createPage, scrapeElementProperty } = require('./_utils');
// const db = require('../../models');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

let browser = null;

const scrapeWeeklyDeals = async () => {
  const spinner = ora('Starting Jumbo scraper...').start();
  const discounts = [];
  const startDate = Date.parse('20 may 2020');
  const endDate = Date.parse('26 may 2020');
  const pageLocation = 'https://www.jumbo.com/aanbiedingen/week';
  const page = await createPage(browser);
  await page.goto(pageLocation);
  const items = await page.$$('div.jum-card-grid div.jum-card');
  spinner.text = `Found ${items.length} discounted items...`;
  for (const item of items) {
    const discount = await scrapeElementProperty(item, 'span.jum-tag');
    const detailsHref = await scrapeElementProperty(item, 'a.jum-promotion-card-button', 'href');
    const detailsPage = await createPage(browser);
    await detailsPage.goto(detailsHref);
    const viableItems = await detailsPage.$$('div.jum-card-grid div.jum-card');
    for (const viableItem of viableItems) {
      const itemName = await scrapeElementProperty(viableItem, 'h3.jum-card-title__text span');
      const discountPrice = await viableItem.$$('span.jum-product-price__current-price span').then(async ([e1, e2]) => {
        const euros = await e1.getProperty('textContent').then((e) => e.jsonValue());
        const cents = await e2.getProperty('textContent').then((e) => e.jsonValue());
        return Number.parseFloat(`${euros}.${cents}`);
      });
      discounts.push({
        id: uuid.v4(),
        label: itemName,
        availability_from: startDate.toString(),
        availability_till: endDate.toString(),
        store_name: 'jumbo',
        discounted: true,
        discount_type: discount,
        new_price: discountPrice,
      });
    }
    await detailsPage.close();
  }
  fs.writeFileSync('jumbo_deals.json', JSON.stringify(discounts));
  await page.close();
  await browser.close();
  spinner.succeed();
};

const start = async (useProxy = false, useHeadless = true) => {
  try {
    const args = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'];
    if (useProxy) {
      args.push(`--proxy-server=${process.env.LUMINATI_PROXY_IP}`);
    }
    browser = await puppeteer.launch({
      headless: useHeadless,
      args,
    });
    await scrapeWeeklyDeals();
    browser.close();
  } catch (error) {
    console.error(error);
  }
};

const stop = async () => {
  if (!browser) {
    return false;
  }
  await browser.close();
  return true;
};

start(false, false);

module.exports = { start, stop };
