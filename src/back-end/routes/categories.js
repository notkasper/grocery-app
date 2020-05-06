const express = require('express');
const {
  getCategories,
  getProductsInCategory,
} = require('../controllers/categories');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCategories);
router.route('/:category_id/:offset').get(getProductsInCategory);

module.exports = router;
