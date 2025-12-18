// This route should be removed or restructured to work with backend auth
// Since the backend has its own JWT auth system, we should either:
// 1. Remove this file and use backend auth directly, or
// 2. Create proxy routes to the backend auth endpoints

// For now, we'll export empty handlers to avoid errors
export async function GET() {
  return new Response('Auth endpoints not implemented', { status: 501 });
}

export async function POST() {
  return new Response('Auth endpoints not implemented', { status: 501 });
}