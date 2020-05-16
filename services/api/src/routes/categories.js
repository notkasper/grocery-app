const express = require('express');
const {
  getCategories,
  getProductsInCategory,
} = require('../controllers/categories');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(authMiddleware, getCategories);
router.route('/:category_id/:page').get(authMiddleware, getProductsInCategory);

module.exports = router;
