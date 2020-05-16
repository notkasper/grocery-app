const express = require('express');
const { scrapeAlbertHeijn } = require('../controllers/scrapers');

const router = express.Router({ mergeParams: true });

router.route('/ah/:useProxy/:useHeadless').post(scrapeAlbertHeijn);
router.route('/product').post(scrapeAlbertHeijn);

module.exports = router;
