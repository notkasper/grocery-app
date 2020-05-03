require('dotenv').config(); // initialize environment variables

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

const authMiddleware = require('./middleware/auth');

let server;

const start = async () => {
  await db.umzug.up();

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
  app.use(express.static(path.join(__dirname, './dist')));

  app.use('/api/v1/products', authMiddleware, products);

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => res.status(500).send({ error }));

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

const stop = () => {
  db.sequelize.close();
  server.close();
};

module.exports = { start, stop };
