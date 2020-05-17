const express = require('express');
const {
  scrapeAlbertHeijn,
  stopAlbertHeijnScraper,
} = require('../controllers/scrapers');
const adminAuthMiddleware = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

router
  .route('/ah/:useProxy/:useHeadless')
  .post(adminAuthMiddleware, scrapeAlbertHeijn);
router.route('/ah/stop').post(adminAuthMiddleware, stopAlbertHeijnScraper);

module.exports = router;
