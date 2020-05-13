/* eslint-disable no-loop-func */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const ora = require('ora');
const puppeteer = require('puppeteer-extra');
const uuid = require('uuid');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { wait, createPage, scrapeElementProperty } = require('./_utils');
const db = require('../models');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

const categories = [
  // {
  //   link: 'https://www.jumbo.com/producten/categorieen/aardappel,-rijst,-pasta/?pageSize=25',
  //   id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
  // },
  {
    link: 'https://www.jumbo.com/producten/categorieen/vlees,-vis,-vegetarisch/?pageSize=25',
    id: '85698cd6-d8eb-4883-8dd2-ba1c1733ec13',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/fruit/?pageSize=25',
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
  },
  {
    link: 'Koken, soepen, maaltijden',
    id: '9eb0ce98-ad14-43ff-b04d-e086c48252de',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/diepvries/?pageSize=25',
    id: '2d07a92d-de8a-4948-809b-9d38b4cd9431',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/brood,-cereals,-beleg/?pageSize=25',
    id: '143ca1c5-2d7e-491a-8e59-0a5c25e4f9e3',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/groente/?pageSize=25',
    id: '81f25338-9164-44e0-854f-f1e1e205fc5c',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/koek,-gebak,-snoep,-chips/?pageSize=25',
    id: 'f0017007-b349-4b59-8cf9-3bf456e01c80',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/zuivel,-eieren,-boter/?pageSize=25',
    id: '444e3a99-8c88-4b09-b70a-0d5108e09906',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/fris,-sap,-koffie,-thee/?pageSize=25',
    id: '6dc98c4d-8e40-46b3-bc15-4121dad2a954',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/wijn,-bier,-sterke-drank/?pageSize=25',
    id: '2e67fcdc-37b0-4782-96c2-f1ed9edf2623',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/drogisterij/?pageSize=25',
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/baby,-peuter/?pageSize=25',
    id: '67937d0d-f761-4dc9-acb5-91952b082f3a',
  },
  {
    link: 'https://www.jumbo.com/producten/categorieen/huishouden,-dieren,-servicebalie/?pageSize=25',
    id: '47cb0d4a-97e9-49c9-acd7-558b24b2ca43',
  },
];

const parseAvailability = (availability) => {
  if (!availability) {
    return null;
  }
  const [from, till] = availability.substring(25, 40).split(' t/m ');
  const [fromDay, fromMonth] = from.split('-');
  const [tillDay, tillMonth] = till.split('-');

  const year = new Date().getFullYear();

  let availabilityFrom = null;
  if (fromDay && fromMonth) {
    availabilityFrom = new Date(year, fromMonth, fromDay);
  }

  let availabilityTill = null;
  if (tillDay && tillMonth) {
    availabilityTill = new Date(year, tillMonth, tillDay);
  }

  return {
    availabilityFrom,
    availabilityTill,
  };
};

const scrape = async () => {
  const errors = [];
  const spinner = ora('Starting Jumbo scraper...').start();
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--proxy-server=${process.env.LUMINATI_PROXY_IP}`,
      ],
    });
    const page = await createPage(browser);
    for (const category of categories) {
      await page.goto(category.link);
      let firstPage = true;
      let done = false;
      let discountCounter = 0;
      while (!done) {
        const products = await page.$$('div.jum-card-grid div.jum-card');
        for (const product of products) {
          try {
            const banner = await product.$('div.banner-content');
            if (!banner) {
              const productImageSrc = await scrapeElementProperty(product, 'img', 'src');
              const discountType = await scrapeElementProperty(product, 'ul.jum-tag-list li span');
              const label = await scrapeElementProperty(product, 'h3.jum-card-title__text span');
              const amount = await scrapeElementProperty(product, 'h4');
              const link = await scrapeElementProperty(product, 'a', 'href');

              const newPrice = await product.$$('span.jum-product-price__current-price span').then(async ([e1, e2]) => {
                const euros = await e1.getProperty('textContent').then((e) => e.jsonValue());
                const cents = await e2.getProperty('textContent').then((e) => e.jsonValue());
                return Number.parseFloat(`${euros}.${cents}`);
              });
              if (discountType) {
                discountCounter += 1;
                spinner.text = `found ${discountCounter} products`;
                const scrapePage = async () => {
                  const productPage = await createPage(browser);
                  await productPage.goto(link);
                  const availability = await scrapeElementProperty(productPage, 'div.promotion-disclaimer h6');
                  await productPage.close();

                  const { availabilityFrom, availabilityTill } = parseAvailability(availability);

                  await db.Product.create({
                    id: uuid.v4(),
                    category: category.id,
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
                };
                await scrapePage();
              }
            }
          } catch (error) {
            errors.push({ messsage: `Error while scraping product\n${error}`, error });
          }
        }

        // go to next page
        let res = await page.$$('div.pagination-buttons-container button.jum-button');
        while (res.length === 0) {
          res = await page.$$('div.pagination-buttons-container button.jum-button');
          await wait(500);
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
      spinner.text = `found ${discountCounter} products | waiting 60 seconds`;
      await wait(60 * 1000);
    }
  } catch (error) {
    errors.push({ message: 'Jumbo scraper crashed...\n', error });
  }

  if (errors.length) {
    console.error(errors);
  }

  spinner.succeed();
};

module.exports = scrape;
