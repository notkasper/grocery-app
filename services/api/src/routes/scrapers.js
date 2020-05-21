const express = require('express');
const { scrapeStore, stopScrapeStore } = require('../controllers/scrapers');
const adminAuthMiddleware = require('../middleware/adminAuth');

const router = express.Router({ mergeParams: true });

router
  .route('/:store/:useProxy/:useHeadless')
  .post(adminAuthMiddleware, scrapeStore);
router.route('/:store/stop').post(adminAuthMiddleware, stopScrapeStore);

module.exports = router;
