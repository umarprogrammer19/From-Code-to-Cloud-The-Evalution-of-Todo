import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const { email, password, name }: SignUpRequest = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please fill in all fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user already exists
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query<User>(userQuery, [email]);

    if (userResult.rows.length > 0) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store the new user in the database
    const insertQuery = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING *`;

    const result = await pool.query<User>(insertQuery, [email, hashedPassword, name || null]);

    const newUser = result.rows[0];

    // Create JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1h' });

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || null
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}