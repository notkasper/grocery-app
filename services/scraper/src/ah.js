/* eslint-disable object-curly-newline */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const uuid = require('uuid');
const categoryMapper = require('./categoryMapper');
const utils = require('./_utils');

const BASE_URL = 'https://www.ah.nl/producten';

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

const scrapeCategoryPage = async (page, categoryName) => {
  const productsInfo = [];
  try {
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
      const amount = await utils.getElementPropertyValue(
        productElement,
        'span.price_unitSize__8gRVX',
        'textContent'
      );
      const discountType = await utils.getElementPropertyValue(
        productElement,
        'span.shield_text__vz1k8',
        'textContent'
      );
      const link = await utils.getElementPropertyValue(
        productElement,
        'a.link_root__65rmW',
        'href'
      );
      const price = 1;
      const productInfo = {
        id: uuid.v4(),
        category: categoryMapper.albertHeijn[categoryName] || null,
        label: label?.substring(0, 1000),
        image: productImageSrc?.substring(0, 1000),
        amount,
        discount_type: discountType,
        availability_from: null,
        availability_till: null,
        store_name: 'albert_heijn',
        link: link?.substring(0, 10000),
        new_price: price,
        // old_price: oldPrice,
        discounted: true,
      };
      productsInfo.push(productInfo);
    }
  } catch (error) {
    console.error(`Scraper encountered an error while scraping category page`);
    throw error;
  }
  return productsInfo;
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
    const cookieButton = await page.$('button#accept-cookies');

    if (cookieButton) {
      cookieButton.click();
      await utils.sleep(2000);
    }

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
      await page.waitForNavigation({
        waitUntil: 'networkidle0',
      });
      // TODO: maybe use this
      // await page.waitForSelector('#example', {
      //   visible: true,
      // });

      const categoryProducts = await scrapeCategoryPage(
        categoryPage,
        categoryName
      );
      products[categoryName] = categoryProducts;
      await categoryPage.close();
      console.info(
        `Found: ${categoryProducts.length} products in category: ${categoryName}`
      );
    }
    utils.writeToFile('ah_products.json', JSON.stringify(products));
    console.info('Albert heijn scraper done...');
  } catch (error) {
    console.error(`Scraper crashed: ${error}`);
  } finally {
    await browser.close();
  }
};

start();
