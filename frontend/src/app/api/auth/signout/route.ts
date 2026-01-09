import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward the signout request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

    const response = await fetch(`${backendUrl}/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...request.headers.has('authorization')
          ? { 'Authorization': request.headers.get('authorization')! }
          : {}
      },
    });

    const data = await response.json().catch(() => ({}));

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Signout proxy error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}