# Quickstart: Phase 2 Frontend

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to FastAPI backend (running on localhost:8000 or production equivalent)

## Setup Instructions

1. **Create Next.js application**
   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --eslint
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install better-auth react-query @types/react-query
   # or
   yarn add better-auth react-query
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
   ```

4. **Initialize better-auth**
   Create `lib/auth.ts`:
   ```typescript
   import { init } from "better-auth";

   export const auth = init({
     secret: process.env.JWT_SECRET || "your-dev-secret",
     plugins: ["jwt"]
   });
   ```

5. **Start development server**
   ```bash
   npm run dev
   # App will be available at http://localhost:3000
   ```

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Next Steps
1. Implement authentication pages (login, register)
2. Create dashboard layout
3. Implement todo CRUD operations
4. Add state management
5. Connect to FastAPI backend