-- Schema for Clock Application (Timeline / Daily Planning & Authentication)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));

-- 2. Timeline Items Table
CREATE TABLE IF NOT EXISTS timeline_items (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'routine',
  color VARCHAR(50) NOT NULL DEFAULT '#F59E0B',
  emoji VARCHAR(20) NOT NULL DEFAULT '☀️',
  notes TEXT,
  repeat_type VARCHAR(50) NOT NULL DEFAULT 'daily',
  specific_days JSONB DEFAULT '[]'::jsonb,
  start_date VARCHAR(20),
  end_date VARCHAR(20),
  completed_dates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timeline_start_time ON timeline_items (start_time);
CREATE INDEX IF NOT EXISTS idx_timeline_repeat_type ON timeline_items (repeat_type);
CREATE INDEX IF NOT EXISTS idx_timeline_user_id ON timeline_items (user_id);
