const express = require('express');
const { scrapeAlbertHeijn } = require('../controllers/scrapers');

const router = express.Router({ mergeParams: true });

router.route('/ah').post(scrapeAlbertHeijn);

module.exports = router;
