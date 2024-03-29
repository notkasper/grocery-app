/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const ora = require('ora');
const uuid = require('uuid');
const utils = require('./_utils');

const categories = [
  {
    link:
      'https://www.jumbo.com/producten/categorieen/aardappel,-rijst,-pasta/?pageSize=25',
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
    label: 'aardappel,-rijst,-pasta',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/vlees,-vis,-vegetarisch/?pageSize=25',
    id: '85698cd6-d8eb-4883-8dd2-ba1c1733ec13',
    label: 'vlees,-vis,-vegetarisch',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/fruit/?pageSize=25',
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
    label: 'fruit',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/koken,-soepen,-maaltijden/?pageSize=25',
    id: '9eb0ce98-ad14-43ff-b04d-e086c48252de',
    label: 'koken,-soepen,-maaltijden',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/diepvries/?pageSize=25',
    id: '2d07a92d-de8a-4948-809b-9d38b4cd9431',
    label: 'diepvries',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/brood,-cereals,-beleg/?pageSize=25',
    id: '143ca1c5-2d7e-491a-8e59-0a5c25e4f9e3',
    label: 'brood,-cereals,-beleg',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/groente/?pageSize=25',
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
    label: 'groente',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/koek,-gebak,-snoep,-chips/?pageSize=25',
    id: 'f0017007-b349-4b59-8cf9-3bf456e01c80',
    label: 'koek,-gebak,-snoep,-chips',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/zuivel,-eieren,-boter/?pageSize=25',
    id: '444e3a99-8c88-4b09-b70a-0d5108e09906',
    label: 'zuivel,-eieren,-boter',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/fris,-sap,-koffie,-thee/?pageSize=25',
    id: '6dc98c4d-8e40-46b3-bc15-4121dad2a954',
    label: 'fris,-sap,-koffie,-thee',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/wijn,-bier,-sterke-drank/?pageSize=25',
    id: '2e67fcdc-37b0-4782-96c2-f1ed9edf2623',
    label: 'wijn,-bier,-sterke-drank',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/drogisterij/?pageSize=25',
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',
    label: 'drogisterij',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/baby,-peuter/?pageSize=25',
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',

    label: 'baby,-peuter',
  },
  {
    link:
      'https://www.jumbo.com/producten/categorieen/huishouden,-dieren,-servicebalie/?pageSize=25',
    id: '47cb0d4a-97e9-49c9-acd7-558b24b2ca43',
    label: 'huishouden,-dieren,-servicebalie',
  },
];

const scrapePriceTag = async (container) => {
  let price = null;
  try {
    const contens = await utils.getElementsPropertyValues(
      container,
      'span',
      'textContent'
    );
    const priceString = contens.join('.');
    price = Number.parseFloat(priceString);
  } catch (error) {
    console.error(`Could not scrape price tag:\n${error}`);
    return null;
  }
  return price;
};

const scrapeCategory = async (page, categoryId) => {
  const spinner = ora('Starting Jumbo scraper...');
  spinner.start();
  const productBuffer = [];
  let firstPage = true;
  let done = false;
  while (!done) {
    const products = await page.$$('div.jum-card-grid div.jum-card');
    for (const product of products) {
      try {
        const banner = await product.$('div.banner-content');
        if (!banner) {
          const productImageSrc = await utils.getElementPropertyValue(
            product,
            'img',
            'src'
          );
          const discountType = await utils.getElementPropertyValue(
            product,
            'ul.jum-tag-list li span',
            'textContent'
          );
          const label = await utils.getElementPropertyValue(
            product,
            'h3.jum-card-title__text span',
            'textContent'
          );
          const amount = await utils.getElementPropertyValue(
            product,
            'h4',
            'textContent'
          );
          const link = await utils.getElementPropertyValue(
            product,
            'a',
            'href'
          );

          const newPriceContainer = await product.$(
            'span.jum-product-price__current-price'
          );
          const newPrice = await scrapePriceTag(newPriceContainer);

          const [, oldPrice] = await Number.parseFloat(
            utils.getElementsPropertyValues(
              product,
              'span.jum-product-price__old-price span',
              'textContent'
            )
          );

          const productData = {
            id: uuid.v4(),
            category: categoryId,
            label: label?.substring(0, 1000) || null,
            image: productImageSrc.substring(0, 1000) || null,
            amount,
            discount_type: discountType || null,
            availability_from: null,
            availability_till: null,
            store_name: 'jumbo',
            link: link?.substring(0, 10000) || null,
            new_price: newPrice,
            old_price: oldPrice || null,
            discounted: !!discountType,
          };
          productBuffer.push(productData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // go to next page
    let res = await page.$$(
      'div.pagination-buttons-container button.jum-button'
    );
    while (res.length === 0) {
      res = await page.$$('div.pagination-buttons-container button.jum-button');
      await utils.sleep(500);
    }
    if (res.length === 1) {
      if (firstPage) {
        const [next] = res;
        next.click();
        firstPage = false;
      } else {
        done = true;
      }
    } else if (res.length === 2) {
      const [, next] = res;
      next.click();
    } else {
      throw new Error(`Found ${res.length} buttons on product page`);
    }
  }
  spinner.succeed();
  return productBuffer;
};

const start = async (categoryLink, useProxy = false, useHeadless = false) => {
  let browser;
  try {
    utils.configurePuppeteer();
    browser = await utils.getBrowser(useProxy, useHeadless);

    // by default loop through all categories, unless a specific category is supplied as node argv argument
    let categoriesToScrape = categories;
    if (categoryLink) {
      const category = categories.find((cat) => cat.link === categoryLink);
      if (!category) {
        throw new Error(`Category link invalid: ${categoryLink}`);
      }
      categoriesToScrape = [category];
    }

    for (const category of categoriesToScrape) {
      const page = await utils.createPage(browser, useProxy);
      await page.goto(category.link);
      const categoryProducts = await scrapeCategory(page, category.id);

      utils.writeToFile(
        `jp_${category.label}.json`,
        JSON.stringify(categoryProducts)
      );
      await page.close();
    }
  } catch (error) {
    console.error(`Scraper crashed: ${error}`);
  } finally {
    browser.close();
  }
};

const [, , categoryLink] = process.argv;
start(categoryLink);
