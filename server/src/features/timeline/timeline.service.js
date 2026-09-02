const { query, pool } = require('../../config/db');

function rowToItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    category: row.category,
    color: row.color,
    emoji: row.emoji,
    notes: row.notes || undefined,
    repeatType: row.repeat_type,
    specificDays: row.specific_days ? (typeof row.specific_days === 'string' ? JSON.parse(row.specific_days) : row.specific_days) : [],
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined,
    completedDates: row.completed_dates ? (typeof row.completed_dates === 'string' ? JSON.parse(row.completed_dates) : row.completed_dates) : [],
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

async function getAllItems(userId) {
  const res = await query(
    'SELECT * FROM timeline_items WHERE user_id = $1 ORDER BY start_time ASC',
    [userId]
  );
  return res.rows.map(rowToItem);
}

async function getItemById(id, userId) {
  const res = await query(
    'SELECT * FROM timeline_items WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (res.rows.length === 0) return null;
  return rowToItem(res.rows[0]);
}

async function createItem(item, userId) {
  const id = item.id || `timeline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = item.title;
  const startTime = item.startTime;
  const endTime = item.endTime;
  const category = item.category || 'routine';
  const color = item.color || '#F59E0B';
  const emoji = item.emoji || '☀️';
  const notes = item.notes || null;
  const repeatType = item.repeatType || 'daily';
  const specificDays = JSON.stringify(item.specificDays || []);
  const startDate = item.startDate || null;
  const endDate = item.endDate || null;
  const completedDates = JSON.stringify(item.completedDates || []);

  const res = await query(
    `INSERT INTO timeline_items (
      id, user_id, title, start_time, end_time, category, color, emoji,
      notes, repeat_type, specific_days, start_date, end_date,
      completed_dates, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      title = EXCLUDED.title,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      category = EXCLUDED.category,
      color = EXCLUDED.color,
      emoji = EXCLUDED.emoji,
      notes = EXCLUDED.notes,
      repeat_type = EXCLUDED.repeat_type,
      specific_days = EXCLUDED.specific_days,
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      completed_dates = EXCLUDED.completed_dates,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *`,
    [
      id,
      userId,
      title,
      startTime,
      endTime,
      category,
      color,
      emoji,
      notes,
      repeatType,
      specificDays,
      startDate,
      endDate,
      completedDates,
    ]
  );

  return rowToItem(res.rows[0]);
}

async function createBatchItems(items, userId) {
  if (!items || items.length === 0) return [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const created = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = item.id || `timeline_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`;
      const title = item.title;
      const startTime = item.startTime;
      const endTime = item.endTime;
      const category = item.category || 'routine';
      const color = item.color || '#F59E0B';
      const emoji = item.emoji || '☀️';
      const notes = item.notes || null;
      const repeatType = item.repeatType || 'daily';
      const specificDays = JSON.stringify(item.specificDays || []);
      const startDate = item.startDate || null;
      const endDate = item.endDate || null;
      const completedDates = JSON.stringify(item.completedDates || []);

      const res = await client.query(
        `INSERT INTO timeline_items (
          id, user_id, title, start_time, end_time, category, color, emoji,
          notes, repeat_type, specific_days, start_date, end_date,
          completed_dates, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          title = EXCLUDED.title,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          category = EXCLUDED.category,
          color = EXCLUDED.color,
          emoji = EXCLUDED.emoji,
          notes = EXCLUDED.notes,
          repeat_type = EXCLUDED.repeat_type,
          specific_days = EXCLUDED.specific_days,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          completed_dates = EXCLUDED.completed_dates,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          id,
          userId,
          title,
          startTime,
          endTime,
          category,
          color,
          emoji,
          notes,
          repeatType,
          specificDays,
          startDate,
          endDate,
          completedDates,
        ]
      );
      created.push(rowToItem(res.rows[0]));
    }
    await client.query('COMMIT');
    return created;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateItem(id, updates, userId) {
  const existing = await getItemById(id, userId);
  if (!existing) return null;

  const title = updates.title !== undefined ? updates.title : existing.title;
  const startTime = updates.startTime !== undefined ? updates.startTime : existing.startTime;
  const endTime = updates.endTime !== undefined ? updates.endTime : existing.endTime;
  const category = updates.category !== undefined ? updates.category : existing.category;
  const color = updates.color !== undefined ? updates.color : existing.color;
  const emoji = updates.emoji !== undefined ? updates.emoji : existing.emoji;
  const notes = updates.notes !== undefined ? updates.notes : existing.notes;
  const repeatType = updates.repeatType !== undefined ? updates.repeatType : existing.repeatType;
  const specificDays = updates.specificDays !== undefined ? JSON.stringify(updates.specificDays) : JSON.stringify(existing.specificDays || []);
  const startDate = updates.startDate !== undefined ? updates.startDate : existing.startDate;
  const endDate = updates.endDate !== undefined ? updates.endDate : existing.endDate;
  const completedDates = updates.completedDates !== undefined ? JSON.stringify(updates.completedDates) : JSON.stringify(existing.completedDates || []);

  const res = await query(
    `UPDATE timeline_items SET
      title = $1,
      start_time = $2,
      end_time = $3,
      category = $4,
      color = $5,
      emoji = $6,
      notes = $7,
      repeat_type = $8,
      specific_days = $9,
      start_date = $10,
      end_date = $11,
      completed_dates = $12,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $13 AND user_id = $14
    RETURNING *`,
    [
      title,
      startTime,
      endTime,
      category,
      color,
      emoji,
      notes,
      repeatType,
      specificDays,
      startDate,
      endDate,
      completedDates,
      id,
      userId,
    ]
  );

  return res.rows.length > 0 ? rowToItem(res.rows[0]) : null;
}

async function toggleCompleteDate(id, targetDateIso, userId) {
  const item = await getItemById(id, userId);
  if (!item) return null;

  const completed = Array.isArray(item.completedDates) ? [...item.completedDates] : [];
  const idx = completed.indexOf(targetDateIso);
  if (idx >= 0) {
    completed.splice(idx, 1);
  } else {
    completed.push(targetDateIso);
  }

  return await updateItem(id, { completedDates: completed }, userId);
}

async function deleteItem(id, userId) {
  const res = await query(
    'DELETE FROM timeline_items WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return res.rows.length > 0;
}

async function replaceTodayItems(targetDateIso, newItems, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete today-only items for this user and specific date
    await client.query(
      "DELETE FROM timeline_items WHERE user_id = $1 AND repeat_type = 'today_only' AND start_date = $2",
      [userId, targetDateIso]
    );

    const created = [];
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      const id = item.id || `timeline_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`;
      const title = item.title;
      const startTime = item.startTime;
      const endTime = item.endTime;
      const category = item.category || 'routine';
      const color = item.color || '#F59E0B';
      const emoji = item.emoji || '☀️';
      const notes = item.notes || null;
      const repeatType = item.repeatType || 'today_only';
      const specificDays = JSON.stringify(item.specificDays || []);
      const startDate = item.startDate || targetDateIso;
      const endDate = item.endDate || null;
      const completedDates = JSON.stringify(item.completedDates || []);

      const res = await client.query(
        `INSERT INTO timeline_items (
          id, user_id, title, start_time, end_time, category, color, emoji,
          notes, repeat_type, specific_days, start_date, end_date,
          completed_dates, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          title = EXCLUDED.title,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          category = EXCLUDED.category,
          color = EXCLUDED.color,
          emoji = EXCLUDED.emoji,
          notes = EXCLUDED.notes,
          repeat_type = EXCLUDED.repeat_type,
          specific_days = EXCLUDED.specific_days,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          completed_dates = EXCLUDED.completed_dates,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          id,
          userId,
          title,
          startTime,
          endTime,
          category,
          color,
          emoji,
          notes,
          repeatType,
          specificDays,
          startDate,
          endDate,
          completedDates,
        ]
      );
      created.push(rowToItem(res.rows[0]));
    }

    await client.query('COMMIT');
    return created;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  createBatchItems,
  updateItem,
  toggleCompleteDate,
  deleteItem,
  replaceTodayItems,
};
