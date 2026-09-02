const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../../config/db');
const config = require('../../config/env');

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const res = await query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
  if (res.rows.length === 0) return null;
  return {
    ...rowToUser(res.rows[0]),
    passwordHash: res.rows[0].password_hash,
  };
}

async function findUserById(id) {
  const res = await query('SELECT * FROM users WHERE id = $1', [id]);
  if (res.rows.length === 0) return null;
  return rowToUser(res.rows[0]);
}

async function createUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const passwordHash = await bcrypt.hash(password, 10);

  const res = await query(
    `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [id, trimmedName, normalizedEmail, passwordHash]
  );

  return rowToUser(res.rows[0]);
}

async function verifyPassword(plainPassword, passwordHash) {
  return await bcrypt.compare(plainPassword, passwordHash);
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  generateToken,
};
