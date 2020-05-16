const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
} = require('../controllers/products');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// called by scraper
router.route('/').post(createProduct);

router.route('/page/:page').get(authMiddleware, getProducts);
router.route('/:id').get(authMiddleware, getProduct);

module.exports = router;
