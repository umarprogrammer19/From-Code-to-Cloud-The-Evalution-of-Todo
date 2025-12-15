import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export the handlers from the auth instance
export const { GET, POST } = toNextJsHandler(auth);