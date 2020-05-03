const express = require('express');
const {
  getFavorites,
  getFavoriteOptions,
  addFavorite,
} = require('../controllers/favorites');

const router = express.Router({ mergeParams: true });

router.route('/').get(getFavorites).post(addFavorite);

router.route('/options').get(getFavoriteOptions);

module.exports = router;
