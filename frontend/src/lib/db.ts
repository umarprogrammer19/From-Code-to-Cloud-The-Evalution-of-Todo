import { Pool } from 'pg';

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/todo_app',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});