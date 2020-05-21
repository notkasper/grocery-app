/* eslint-disable no-unused-vars */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const chalk = require('chalk');
const albert_heijn = require('./ah');
const jumbo = require('./jumbo');

let server;

const scrapers = {
  jumbo,
  albert_heijn,
};

const start = async () => {
  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(express.json());

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => res.status(500).send({ error }));

  app.post('/start/:store/:useProxy/:useHeadless', (req, res) => {
    try {
      const { store } = req.params;
      const useProxy = req.params.useProxy === 'true';
      const useHeadless = req.params.useHeadless === 'true';
      const scraper = scrapers[store];
      if (!scraper) {
        res.status(400).send({ error: `Invalid store: ${store}` });
        return;
      }
      scraper.start(useProxy, useHeadless);
      res.status(200).send({ data: 'Scraper started' });
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  app.post('/stop/:store', async (req, res) => {
    try {
      const { store } = req.params;
      const scraper = scrapers[store];
      if (!scraper) {
        res.status(400).send({ error: `Invalid store: ${store}` });
        return;
      }
      const stopped = await scraper.stop();
      if (stopped) {
        res.status(200).send({ data: 'Scraper stopped' });
        return;
      }
      res
        .status(200)
        .send({ data: 'Unable to stop scraper: scraper not running' });
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 6000;
  server = app.listen(PORT, () =>
    console.info(
      chalk.yellow.bold(
        `Scraping server running in ${NODE_ENV} mode on port ${PORT}`
      )
    )
  );

  process.on('unhandledRejection', (error) => {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    app.close(() => {
      process.exit(1);
    });
  });
};

start();
