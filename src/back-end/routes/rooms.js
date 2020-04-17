const express = require('express');
const { getRooms } = require('../controllers/rooms');

const router = express.Router({ mergeParams: true });

router.route('/').get(getRooms);

module.exports = router;
