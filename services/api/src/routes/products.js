const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  createProducts,
  deleteProducts,
  deleteProduct,
} = require('../controllers/products');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

// called by scraper
router
  .route('/')
  .post(createProduct)
  .delete(adminAuthMiddleware, deleteProducts);
router.route('/bulk').post(adminAuthMiddleware, createProducts);

router.route('/page/:page').get(authMiddleware, getProducts);
router
  .route('/:id')
  .get(authMiddleware, getProduct)
  .delete(adminAuthMiddleware, deleteProduct);

module.exports = router;
