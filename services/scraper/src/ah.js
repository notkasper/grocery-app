/* eslint-disable object-curly-newline */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const uuid = require('uuid');
const categoryMapper = require('./categoryMapper');
const utils = require('./_utils');

const BASE_URL = 'https://www.ah.nl/producten';
const MAX_PAGES = 60;
const STORE_NAME = 'albert_heijn';

// const parseAvailabilityTill = (unparsed) => {
//   if (!unparsed) {
//     return null;
//   }
//   const daynameMap = {
//     maandag: 'mon',
//     dinsdag: 'tue',
//     woensdag: 'wed',
//     donderdag: 'thu',
//     vrijdag: 'fri',
//     zaterdag: 'sat',
//     zondag: 'sun',
//   };
//   const getNextDayOfTheWeek = (
//     dayName,
//     excludeToday = true,
//     refDate = new Date()
//   ) => {
//     if (!dayName) {
//       return null;
//     }
//     const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(
//       dayName.slice(0, 3).toLowerCase()
//     );
//     if (dayOfWeek < 0) return null;
//     refDate.setHours(0, 0, 0, 0);
//     // eslint-disable-next-line max-len
//     refDate.setDate(
//       refDate.getDate() +
//         !!excludeToday +
//         (((dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7) + 1)
//     );
//     return refDate;
//   };

//   const trimmed = unparsed.replace('t/m', '').trim().toLowerCase();
//   const parsed = getNextDayOfTheWeek(daynameMap[trimmed], false);

//   return parsed;
// };

const scrapePriceTag = async (container) => {
  let price = null;
  try {
    const contens = await utils.getElementsPropertyValues(
      container,
      'span',
      'textContent'
    );
    const priceString = contens.join('');
    price = Number.parseFloat(priceString);
  } catch (error) {
    console.error(`Could not scrape price tag:\n${error}`);
    return null;
  }
  return price;
};

const getTotalPages = async (page) => {
  const loadMoreText = await utils.getElementPropertyValue(
    page,
    'div.load-more_root__9MiHC span',
    'textContent'
  );
  if (!loadMoreText) {
    console.error('Could not find load more text on this page');
    return null;
  }

  const loadMoreRegex = /^(?<perPage>\d+)\svan\sde\s((?<total>\d+))\sresultaten\sweergegeven$/;
  const match = loadMoreText.match(loadMoreRegex);
  if (!match) {
    console.error('Load more regex did not return expected results');
    return null;
  }
  const {
    groups: { perPage, total },
  } = match;
  if (!perPage || !total) {
    console.error('Load more regex did not return expected results');
    return null;
  }
  let totalPages = Math.ceil(total / perPage);
  if (totalPages > MAX_PAGES) {
    // more than MAX_PAGES appears to crash the webpage
    totalPages = MAX_PAGES;
  }
  return totalPages;
};

const getProductsOnPage = async (page, categoryName) => {
  const productsInfo = [];
  try {
    // navigate to page that contains all products
    console.info('Navigating to final page...');
    const totalPages = await getTotalPages(page);
    if (!totalPages) {
      return null;
    }
    const lastPageUrl = `${page.url()}?page=${totalPages}`;
    await page.goto(lastPageUrl);
    await utils.sleep(5000);

    // scrape all products
    console.info('Scraping category page...');
    const productElements = await page.$$('article');
    console.info(`Found ${productElements.length} products...`);
    for (const productElement of productElements) {
      const label = await utils.getElementPropertyValue(
        productElement,
        'a strong span',
        'textContent'
      );
      const productImageSrc = await utils.getElementPropertyValue(
        productElement,
        'img',
        'src'
      );
      const link = await utils.getElementPropertyValue(
        productElement,
        'a.link_root__65rmW',
        'href'
      );

      // price related stuff
      const amount = await utils.getElementPropertyValue(
        productElement,
        'span.price_unitSize__8gRVX',
        'textContent'
      );
      const newPriceContainer = await productElement.$(
        'div.price-amount_root__37xv2'
      );
      const newPrice = await scrapePriceTag(newPriceContainer);

      // make product object
      const productInfo = {
        id: uuid.v4(),
        category: categoryMapper.albertHeijn[categoryName] || null,
        label: label?.substring(0, 1000) || null,
        image: productImageSrc?.substring(0, 1000) || null,
        amount,
        availability_from: null,
        availability_till: null,
        store_name: STORE_NAME,
        link: link?.substring(0, 10000),
        new_price: newPrice,
        discounted: false,
      };

      productsInfo.push(productInfo);
    }
  } catch (error) {
    console.error(`Scraper encountered an error while scraping category page`);
    throw error;
  }
  return productsInfo;
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
    console.info('Starting scraper...');

    browser = await utils.getBrowser(useProxy, useHeadless);
    console.info('Browser started...');

    const page = await utils.createPage(browser, useProxy);
    await page.goto(BASE_URL);
    // TODO: Wait for element to load instead of hardcoded wait
    await utils.sleep(2000);
    console.info('At homepage...');

    // Sometimes the cookie banner shows up, needs to be accepted in order to further navigate
    await clearCookiePopup(page);

    // Get all categories
    const categoryOverviews = await page.$$(
      'div.product-category-overview_category__1H99m'
    );
    console.info(`Found ${categoryOverviews.length} categories...`);

    const products = {};
    for (const categoryOverview of categoryOverviews) {
      const categoryName = await utils.getElementPropertyValue(
        categoryOverview,
        'a.taxonomy-card_titleLink__7TTrF',
        'textContent'
      );
      const categoryHref = await utils.getElementPropertyValue(
        categoryOverview,
        'a.taxonomy-card_titleLink__7TTrF',
        'href'
      );
      console.info(
        `Scraping category: ${categoryName} at url: ${categoryHref}`
      );
      const categoryPage = await utils.createPage(browser, useProxy);
      await categoryPage.goto(categoryHref);

      const categoryProducts = await getProductsOnPage(
        categoryPage,
        categoryName
      );
      utils.writeToFile(
        `ahp_${categoryName}.json`,
        JSON.stringify(categoryProducts)
      );
      console.info(
        `Found: ${categoryProducts.length} products in category: ${categoryName}`
      );
      await utils.sleep(1000);
      await categoryPage.close();
    }
    console.info('Albert heijn scraper done...');
  } catch (error) {
    console.error(`Scraper crashed: ${error}`);
  } finally {
    browser.close();
  }
};

start();
