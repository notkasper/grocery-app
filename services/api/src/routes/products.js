const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  createProducts,
  deleteAllProducts,
  deleteProduct,
  deleteProducts,
  compareStoreProducts,
  deleteProductsFromStore,
} = require('../controllers/products');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authMiddleware, getProducts)
  .post(createProduct)
  .delete(adminAuthMiddleware, deleteAllProducts);
router.route('/bulk').post(adminAuthMiddleware, createProducts);

router
  .route('/:id')
  .get(authMiddleware, getProduct)
  .delete(adminAuthMiddleware, deleteProduct);

router.route('/delete/bulk').delete(adminAuthMiddleware, deleteProducts);
router
  .route('/delete/store')
  .delete(adminAuthMiddleware, deleteProductsFromStore);
router.route('/compare').post(adminAuthMiddleware, compareStoreProducts);

module.exports = router;
