// require('dotenv').config(); // initialize environment variables

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const chalk = require('chalk');

const db = require('./models');
const products = require('./routes/products');
const favorites = require('./routes/favorites');
const categories = require('./routes/categories');
const scrapers = require('./routes/scrapers');

const authMiddleware = require('./middleware/auth');

let server;

const start = async () => {
  try {
    await db.umzug.up();
  } catch (error) {
    console.error(error);
  }

  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Body parser
  app.use(express.json());

  // Cookie parser
  app.use(cookieParser());

  // File uploading
  app.use(fileupload());

  // Security headers
  app.use(helmet());

  // Xss prevention
  app.use(xssClean());

  // Prevent http param pollution
  app.use(hpp());

  // CORS
  app.use(cors());

  // Set static folder
  app.use(express.static(path.join(__dirname, '/../../dist')));

  app.use('/api/v1/products', authMiddleware, products);
  app.use('/api/v1/favorites', authMiddleware, favorites);
  app.use('/api/v1/categories', authMiddleware, categories);
  app.use('/api/v1/scrapers', scrapers); // TODO: add middleware!

  app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../../dist/index.html`));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => res.status(500).send({ error }));

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = process.env.NODE_ENV || 5000;
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

const stop = () => {
  db.sequelize.close();
  server.close();
};

module.exports = { start, stop };