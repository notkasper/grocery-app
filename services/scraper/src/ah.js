/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer-extra');
const uuid = require('uuid');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const categoryMapper = require('./categoryMapper');
const { createPage, createProduct, wait } = require('./_utils');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

const parseAvailabilityTill = (unparsed) => {
  if (!unparsed) {
    return null;
  }
  const daynameMap = {
    maandag: 'mon',
    dinsdag: 'tue',
    woensdag: 'wed',
    donderdag: 'thu',
    vrijdag: 'fri',
    zaterdag: 'sat',
    zondag: 'sun',
  };
  const getNextDayOfTheWeek = (
    dayName,
    excludeToday = true,
    refDate = new Date()
  ) => {
    if (!dayName) {
      return null;
    }
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(
      dayName.slice(0, 3).toLowerCase()
    );
    if (dayOfWeek < 0) return null;
    refDate.setHours(0, 0, 0, 0);
    // eslint-disable-next-line max-len
    refDate.setDate(
      refDate.getDate() +
        !!excludeToday +
        (((dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7) + 1)
    );
    return refDate;
  };

  const trimmed = unparsed.replace('t/m', '').trim().toLowerCase();
  const parsed = getNextDayOfTheWeek(daynameMap[trimmed], false);

  return parsed;
};

const scrapeAlbertHeijn = async () => {
  console.info('Starting scraper...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${process.env.LUMINATI_PROXY_IP}`,
    ],
  });
  console.info('Browser started...');
  const page = await createPage(browser);
  await page.goto('https://www.ah.nl/producten');
  console.info('Directed to homepage...');
  await wait(2000);

  const categoryOverviews = await page.$$(
    'div.product-category-overview_category__E6EMG'
  );
  console.info(`Found ${categoryOverviews.length} categories...`);
  for (const categoryOverview of categoryOverviews) {
    const categoryName = await categoryOverview
      .$('a.taxonomy-card_titleLink__1Dgai')
      .then((e) => e.getProperty('textContent'))
      .then((e) => e.jsonValue());
    const categoryHref = await categoryOverview
      .$('a.taxonomy-card_titleLink__1Dgai')
      .then((e) => e.getProperty('href'))
      .then((e) => e.jsonValue());
    const categoryPage = await createPage(browser);
    const pageUrl = `${categoryHref}?kenmerk=bonus&page=100`;
    try {
      await categoryPage.goto(pageUrl);
      console.info('Going to new category page...');
      // await autoScroll(categoryPage); // TODO: FIX THIS
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
        const availableTill = await product
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
              const value = await e
                .getProperty('textContent')
                .then((textContent) => textContent.jsonValue());
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
              const value = await e
                .getProperty('textContent')
                .then((textContent) => textContent.jsonValue());
              oldPrice = `${oldPrice}${value}`;
            }
          });
        oldPrice = Number.parseFloat(oldPrice) || null;
        await createProduct({
          id: uuid.v4(),
          category: categoryMapper.albertHeijn[categoryName] || null,
          label: label.substring(0, 1000),
          image: productImageSrc.substring(0, 1000),
          amount,
          discount_type: discountType,
          availability_from: null,
          availability_till: availableTill
            ? parseAvailabilityTill(availableTill)
            : null,
          store_name: 'albert_heijn',
          link: link.substring(0, 10000),
          new_price: newPrice,
          old_price: oldPrice,
          discounted: true,
        });
        console.info('GProduct created...');
      }
      await categoryPage.close();
    } catch (error) {
      console.error(
        `Scraper encountered an error while scraping: ${pageUrl}: ${error}`
      );
    }
  }
  console.info('Albert heijn scraper done...');
  await browser.close();
};

module.exports = scrapeAlbertHeijn;
