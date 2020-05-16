/* eslint-disable no-unused-vars */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const chalk = require('chalk');
const ah = require('./ah');
const jumbo = require('./jumbo');

let server;

const start = async () => {
  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(express.json());

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => res.status(500).send({ error }));

  app.post('/ah/:useProxy/:useHeadless', (req, res) => {
    const useProxy = req.params.useProxy === 'true';
    const useHeadless = req.params.useHeadless === 'true';
    ah(useProxy, useHeadless);
    res.status(200).send({ data: 'Scraper started' });
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
