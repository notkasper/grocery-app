const express = require('express');
const {
  getFavorites,
  getFavoriteOptions,
  addFavorite,
  deleteFavorite,
} = require('../controllers/favorites');

const router = express.Router({ mergeParams: true });

router.route('/').get(getFavorites);
router.route('/:id').delete(deleteFavorite);
router.route('/options/:term').get(getFavoriteOptions);
router.route('/:category_id/:term').post(addFavorite);

module.exports = router;
