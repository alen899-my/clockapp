const timelineService = require('./timeline.service');

async function getAllItems(req, res, next) {
  try {
    const userId = req.user.id;
    const items = await timelineService.getAllItems(userId);
    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
}

async function getItemById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const item = await timelineService.getItemById(id, userId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { message: `Timeline item with id '${id}' not found` },
      });
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: { message: 'title, startTime, and endTime are required fields' },
      });
    }
    const userId = req.user.id;
    const created = await timelineService.createItem(req.body, userId);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

async function createBatch(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: { message: 'items must be an array' },
      });
    }
    const userId = req.user.id;
    const created = await timelineService.createBatchItems(items, userId);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updated = await timelineService.updateItem(id, req.body, userId);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: `Timeline item with id '${id}' not found` },
      });
    }
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function toggleComplete(req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const userId = req.user.id;
    if (!date) {
      return res.status(400).json({
        success: false,
        error: { message: 'date (YYYY-MM-DD) is required in request body' },
      });
    }
    const updated = await timelineService.toggleCompleteDate(id, date, userId);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: `Timeline item with id '${id}' not found` },
      });
    }
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await timelineService.deleteItem(id, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: `Timeline item with id '${id}' not found` },
      });
    }
    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: { id },
    });
  } catch (err) {
    next(err);
  }
}

async function replaceTodayItems(req, res, next) {
  try {
    const { date, items } = req.body;
    if (!date || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: { message: 'date and items array are required' },
      });
    }
    const userId = req.user.id;
    const created = await timelineService.replaceTodayItems(date, items, userId);
    res.json({
      success: true,
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  createBatch,
  updateItem,
  toggleComplete,
  deleteItem,
  replaceTodayItems,
};
