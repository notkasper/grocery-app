const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
} = require('../controllers/products');

const router = express.Router({ mergeParams: true });

router.route('/').post(createProduct);
router.route('/page/:page').get(getProducts);
router.route('/:id').get(getProduct);

module.exports = router;
