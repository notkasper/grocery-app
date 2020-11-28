/* eslint-disable object-curly-newline */
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const pup = require('puppeteer-extra');
const fs = require('fs');

const sleep = async (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

const configurePuppeteer = (stealth = true) => {
  if (stealth) {
    pup.use(StealthPlugin());
  }
};

const getBrowser = async (useProxy, useHeadless) => {
  try {
    const args = [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ];
    if (useProxy) {
      args.push(`--proxy-server=${process.env.LUMINATI_PROXY_IP}`);
    }
    const browser = await pup.launch({
      headless: useHeadless,
      args,
    });
    return browser;
  } catch (error) {
    console.error(
      `Error while creating browser with parameters: ${JSON.stringify({
        useProxy,
        useHeadless,
      })}`
    );
    throw error;
  }
};

const createPage = async (browser, useProxy) => {
  try {
    const page = await browser.newPage();
    if (useProxy) {
      await page.authenticate({
        username: process.env.LUMINATI_USERNAME,
        password: process.env.LUMINATI_PASSWORD,
      });
    }
    await page.setViewport({ width: 1920, height: 1080 });
    return page;
  } catch (error) {
    console.error(
      `Error while creating page with parameters: ${JSON.stringify({
        useProxy,
      })}`
    );
    throw error;
  }
};

const getElementPropertyValue = async (page, identifier, property) => {
  let propertyValue;
  try {
    const element = await page.$(identifier);
    if (!element) return null;
    const rawValue = await element.getProperty(property);
    propertyValue = await rawValue.jsonValue();
    return propertyValue;
  } catch (error) {
    console.error(
      `Error while getting property value using params: ${JSON.stringify({
        identifier,
        property,
      })}`
    );
  }
  return propertyValue;
};

const writeToFile = async (filename = 'temp.json', products) => {
  fs.writeFileSync(filename, products);
};

module.exports = {
  configurePuppeteer,
  getBrowser,
  getElementPropertyValue,
  sleep,
  createPage,
  writeToFile,
};
