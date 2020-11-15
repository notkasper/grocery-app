const express = require('express');
const { getUsers } = require('../controllers/users');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

router.route('/').get(adminAuth, getUsers);

module.exports = router;
