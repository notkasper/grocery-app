const express = require('express');
const {
  getFavorites,
  getFavoriteOptions,
  addFavorite,
} = require('../controllers/favorites');

const router = express.Router({ mergeParams: true });

router.route('/').get(getFavorites);
router.route('/options/:term').get(getFavoriteOptions);
router.route('/:category_id/:term').post(addFavorite);

module.exports = router;
