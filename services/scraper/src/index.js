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

  app.post('/scraper/ah', (req, res) => {
    ah();
    res.status(200).send({ data: 'Scraper started' });
  });

  const { PORT, NODE_ENV } = process.env;
  server = app.listen(PORT, () =>
    console.info(
      chalk.yellow.bold(`Server running in ${NODE_ENV} mode on port ${PORT}`)
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
