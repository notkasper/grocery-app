const express = require('express');
const {
  addListItem,
  deleteListItemAll,
  deleteListItemSingle,
  getListItems,
} = require('../controllers/list');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(authMiddleware, getListItems);
router
  .route('/:id')
  .delete(authMiddleware, deleteListItemSingle)
  .post(authMiddleware, addListItem);
router.route('/:id/all').delete(authMiddleware, deleteListItemAll);

module.exports = router;
