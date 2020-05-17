const express = require('express');
const { getCategories } = require('../controllers/categories');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(authMiddleware, getCategories);

module.exports = router;
