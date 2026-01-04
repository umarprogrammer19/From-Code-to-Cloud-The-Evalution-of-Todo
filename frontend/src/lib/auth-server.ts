import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || '',
  },
  secret: process.env.BETTER_AUTH_SECRET || 'fallback_secret_for_dev',
  // Disable email verification for development
  emailAndPassword: {
    enabled: true,
  },
});