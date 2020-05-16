const express = require('express');
const {
  getFavorites,
  getFavoriteOptions,
  addFavorite,
  deleteFavorite,
} = require('../controllers/favorites');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(authMiddleware, getFavorites);
router.route('/:id').delete(authMiddleware, deleteFavorite);
router.route('/options/:term').get(authMiddleware, getFavoriteOptions);
router.route('/:category_id/:term').post(authMiddleware, addFavorite);

module.exports = router;
