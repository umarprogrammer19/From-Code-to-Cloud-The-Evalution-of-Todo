import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL || "postgres://user:password@localhost:5432/database",
  }),
  secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET || "",
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  trustHost: true,
  emailAndPassword: {
    enabled: true,
  },
});