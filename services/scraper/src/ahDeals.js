/* eslint-disable object-curly-newline */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const utils = require('./_utils');

const BASE_URL = 'https://www.ah.nl/bonus';

const scrapePriceTag = async (container) => {
  try {
    const contens = await utils.getElementsPropertyValues(
      container,
      'span',
      'textContent'
    );
    const priceString = contens.join('');
    const price = Number.parseFloat(priceString);
    return price;
  } catch (error) {
    console.error(`Could not scrape price tag:\n${error}`);
  }
};

// TODO: press load more button when available
const scrapeDealPage = async (page) => {
  const data = [];
  try {
    await utils.sleep(2000); // TODO: Remove hardcoded sleep, instead wait for an element to load
    const products = await page.$$('article');
    console.log(`Found ${products.length} products in deal`);
    for (const product of products) {
      const label = await utils.getElementPropertyValue(
        product,
        'strong span',
        'textContent'
      );
      const discount = await utils.getElementPropertyValue(
        product,
        'span.shield_text__3VXuZ',
        'textContent'
      );
      const priceContainer = await product.$('div.price_portrait__2WpRE');
      const amount = await utils.getElementPropertyValue(
        priceContainer,
        'span',
        'textContent'
      );
      const oldPriceContainer = await priceContainer.$(
        'div.price-amount_was__3hzTZ'
      );
      const newPriceContainer = await priceContainer.$(
        'div.price-amount_highlight__3wDJh'
      );

      // old price is not always present for a deal
      let oldPrice = null;
      if (oldPriceContainer) {
        oldPrice = await scrapePriceTag(oldPriceContainer);
      }

      const newPrice = await scrapePriceTag(newPriceContainer);
      data.push({
        label,
        amount,
        oldPrice,
        newPrice,
        discount,
      });
    }
    await page.close();
  } catch (error) {
    console.error(`Error while scraping deal page:\n${error}`);
  }
  return data;
};

const scrapeSection = async (browser, section, useProxy) => {
  let products = [];
  try {
    const deals = await section.$$('div.grid-item_spanOne__txEVS'); // TODO: This doesnt work for all articles
    console.log(`found ${deals.length} deals`);

    const promises = [];
    for (const deal of deals) {
      // first we check if the deal contains subdeals, or if it links directly to a product
      const hasSubDeals = !(await deal.$('button.plus-button'));
      if (hasSubDeals) {
        const href = await utils.getElementPropertyValue(
          deal,
          'article div a',
          'href'
        );
        console.log(`href: ${href}`);
        const dealPage = await utils.createPage(browser, useProxy);
        await dealPage.goto(href);
        const promise = scrapeDealPage(dealPage);
        promises.push(promise);
      } else {
        // scrape regular stuff
      }
    }

    // each promise returns an array, so flatten it
    products = utils.flatten(await Promise.all(promises));
    console.log('PRODUCTS IN SCRAPE SECTION');
    console.log(products);
    return products;
  } catch (error) {
    console.error(`Error while scraping section:\n${error}`);
  }
  return products;
};

const clearCookiePopup = async (page) => {
  const cookieButton = await page.$('button#decline-cookies');

  if (cookieButton) {
    cookieButton.click();
    await utils.sleep(2000);
  }
};

const start = async (useProxy = false, useHeadless = false) => {
  let browser;
  try {
    // setup basics
    utils.configurePuppeteer();
    console.info('Starting Albert Heijn deals scraper...');

    browser = await utils.getBrowser(useProxy, useHeadless);
    console.info('Browser started...');

    const page = await utils.createPage(browser, useProxy);
    await page.goto(BASE_URL);
    // TODO: Wait for element to load instead of hardcoded wait
    await utils.sleep(2000);
    console.info('At deals page...');

    // Sometimes the cookie banner shows up, needs to be cleared in order to further navigate
    await clearCookiePopup(page);

    // Get all deal sections
    const sections = await page.$$('section');

    const deals = [];
    for (const section of sections) {
      const products = await scrapeSection(browser, section, useProxy);
      deals.push(products);
    }

    utils.writeToFile('ah_deals.json', JSON.stringify(deals));
    console.info('Albert heijn deals scraper done...');
  } catch (error) {
    console.error(`Scraper crashed: ${error}`);
  } finally {
    // browser.close();
  }
};

start();
