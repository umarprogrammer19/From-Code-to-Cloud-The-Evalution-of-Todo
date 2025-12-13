<!-- SYNC IMPACT REPORT:
Version change: 1.1.0 -> 2.0.0
Modified principles: I. Project Scope (Interactive TUI) -> I. Project Scope (Full-Stack Monorepo), II. Tech Stack Standards (Enhanced) -> II. Tech Stack Standards (Full-Stack), III. Architecture (Non-Negotiable) -> III. Architecture (Full-Stack Non-Negotiable), IV. Test-First Approach -> IV. Test-First Approach (Full-Stack), V. Data Management -> V. Data Management (Database-Driven), VI. Code Quality Standards -> VI. Code Quality Standards (Full-Stack)
Added sections: VII. Authentication Rules, VIII. API Standards
Removed sections: UX Standards
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: Verify all dependent templates are updated for Phase 2
-->
# Todo App Constitution

## Core Principles

### I. Project Scope (Full-Stack Monorepo)
**Goal**: Build a multi-user web app with Next.js (Frontend) and FastAPI (Backend); **Structure**: `frontend/`: Next.js 16+ (App Router), `backend/`: FastAPI + SQLModel, `specs/`: Centralized feature specifications; **Constraint**: All code must be in a single monorepo structure

### II. Tech Stack Standards (Full-Stack)
**Backend**: Python 3.13+, FastAPI, Uvicorn, SQLModel; Managed by `uv`; **Database**: Neon Serverless PostgreSQL; **Frontend**: Next.js 16+, TypeScript, Tailwind CSS; **Auth**: Better Auth (Frontend) + JWT Verification (Backend); **Package Management**: STRICTLY use `uv add` for backend dependencies and `npm`/`yarn` for frontend

### III. Architecture (Full-Stack Non-Negotiable)
frontend/: Next.js 16+ with App Router for UI components and routing; backend/: FastAPI + SQLModel for API endpoints and data models; specs/: Centralized feature specifications; data/: Database schema definitions and migrations; Strict separation of concerns between frontend, backend, and shared logic; **Dependency Management**: Use `uv` for Python dependencies, npm/yarn for JavaScript/TypeScript

### IV. Test-First Approach (Full-Stack)
TDD mandatory for both frontend and backend: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced; pytest for backend tests, Jest/Cypress for frontend tests; Unit and integration tests required for all critical paths

### V. Data Management (Database-Driven)
Neon Serverless PostgreSQL as the single source of truth; SQLModel for ORM and database schema management; Proper database connection handling and transaction management; Data integrity and validation required at both frontend and backend; Database migration scripts must be version-controlled

### VI. Code Quality Standards (Full-Stack)
All code must follow clean architecture principles; Frontend components must be properly typed with TypeScript; Backend API routes must follow RESTful conventions; Error handling for database operations and network requests; Type hints required throughout backend code; Consistent code formatting using ESLint/Prettier for frontend and Black/isort for backend

### VII. Authentication Rules (Strict)
**Frontend**: Use `better-auth` to handle Sign-in/Sign-up and issue JWT tokens; **Backend**: MUST NOT manage sessions, it validates the JWT `Bearer` token from the header; **Data Isolation**: All API queries must filter by the `user_id` extracted from the token; **Security**: JWT tokens must be properly validated with appropriate expiration and refresh mechanisms

### VIII. API Standards (Strict)
All endpoints: `/api/{user_id}/...`; Backend runs on Port `8000`; Frontend runs on Port `3000`; All API responses must follow consistent JSON structure; Error responses must include appropriate HTTP status codes and descriptive messages; API rate limiting and validation required

## Architecture Constraints

- **Backend Framework**: FastAPI with SQLModel for database operations
- **Frontend Framework**: Next.js 16+ with App Router
- **Database**: Neon Serverless PostgreSQL only
- **Authentication**: Better Auth for frontend, JWT verification for backend
- **API Endpoints**: All must follow `/api/{user_id}/...` pattern
- **Port Configuration**: Backend on port 8000, Frontend on port 3000
- **Forbidden**: No other database systems, no session-based authentication
- **Dependency Management**: Use `uv` for Python, npm/yarn for JavaScript/TypeScript

## Development Workflow

- frontend/: Next.js application (components, pages, API routes)
- backend/: FastAPI application (routers, models, services)
- specs/: Feature specifications and architectural plans
- data/: Database schema and migration files
- All new features must have corresponding tests for both frontend and backend
- Code reviews must verify compliance with architecture constraints
- Follow separation of concerns strictly between frontend, backend, and shared utilities

## Governance

All implementations must comply with this constitution; Architecture violations must be corrected; Dependencies must be added via `uv` for Python and npm/yarn for JS/TS; Database operations must use SQLModel with proper user isolation; Changes to architecture require constitution amendments; Authentication must follow JWT-only approach without sessions

**Version**: 2.0.0 | **Ratified**: 2025-12-12 | **Last Amended**: 2025-12-13