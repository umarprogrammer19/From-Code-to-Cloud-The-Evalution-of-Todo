import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password }: SignInRequest = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please fill in all fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user exists
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query<User>(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1h' });

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || null
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Signin error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}