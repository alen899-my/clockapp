const express = require('express');
const router = express.Router();
const timelineController = require('./timeline.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

// All timeline routes require authentication
router.use(authMiddleware);

// GET all items for the authenticated user
router.get('/', timelineController.getAllItems);

// GET single item
router.get('/:id', timelineController.getItemById);

// POST single item
router.post('/', timelineController.createItem);

// POST batch create items (e.g. templates)
router.post('/batch', timelineController.createBatch);

// PUT replace today's items
router.put('/replace-today', timelineController.replaceTodayItems);

// PUT update item
router.put('/:id', timelineController.updateItem);

// PATCH toggle complete for a date
router.patch('/:id/toggle-complete', timelineController.toggleComplete);

// DELETE item
router.delete('/:id', timelineController.deleteItem);

module.exports = router;
