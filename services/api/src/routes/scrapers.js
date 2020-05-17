const express = require('express');
const {
  scrapeAlbertHeijn,
  stopAlbertHeijnScraper,
} = require('../controllers/scrapers');

const router = express.Router({ mergeParams: true });

router.route('/ah/:useProxy/:useHeadless').post(scrapeAlbertHeijn); // TODO: add admin middleware
router.route('/ah/stop').post(stopAlbertHeijnScraper); // TODO: add admin middleware

module.exports = router;
