const express = require('express');
const { getCategories } = require('../controllers/categories');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCategories);

module.exports = router;
