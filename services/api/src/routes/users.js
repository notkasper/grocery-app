const express = require('express');
const { getUsers, deleteUser } = require('../controllers/users');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

router.route('/').get(adminAuth, getUsers);
router.route('/:firebase_uid').delete(adminAuth, deleteUser);

module.exports = router;
