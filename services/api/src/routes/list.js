const express = require('express');
const {
  addListItem,
  deleteListItem,
  getListItems,
} = require('../controllers/list');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(authMiddleware, getListItems);
router
  .route('/:id')
  .delete(authMiddleware, deleteListItem)
  .post(authMiddleware, addListItem);

module.exports = router;
