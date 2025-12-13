---
id: "002"
title: "Update Constitution Phase2"
stage: "constitution"
date_iso: "2025-12-13"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "none"
branch: "main"
user: "Umar Farooq"
command: "/sp.constitution"
labels: ["constitution", "phase2", "monorepo", "fullstack"]
link_spec: "null"
link_ticket: "null"
link_adr: "null"
link_pr: "null"
files_yaml: |
  - .specify/memory/constitution.md
tests_yaml: |
  - none
---

# Update Constitution Phase2

## User Input

Update `.specify/memory/constitution.md` with these strict laws for Phase 2:

1. **Project Scope (Phase 2: Full-Stack Monorepo)**:
   - **Goal**: Build a multi-user web app with Next.js (Frontend) and FastAPI (Backend)
   - **Structure**:
     - `frontend/`: Next.js 16+ (App Router)
     - `backend/`: FastAPI + SQLModel
     - `specs/`: Centralized feature specifications

2. **Tech Stack**:
   - **Backend**: Python 3.13+, FastAPI, Uvicorn, SQLModel. Managed by `uv`
   - **Database**: Neon Serverless PostgreSQL
   - **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
   - **Auth**: **Better Auth** (Frontend) + **JWT Verification** (Backend)

3. **Authentication Rules (Strict)**:
   - **Frontend**: Use `better-auth` to handle Sign-in/Sign-up and issue JWT tokens
   - **Backend**: MUST NOT manage sessions. It validates the JWT `Bearer` token from the header
   - **Data Isolation**: All API queries must filter by the `user_id` extracted from the token

4. **API Standards**:
   - All endpoints: `/api/{user_id}/...`
   - Backend runs on Port `8000`. Frontend runs on Port `3000`

## Response Summary

Updated the project constitution from version 1.1.0 to 2.0.0 to reflect Phase 2 requirements for a full-stack monorepo architecture. The new constitution includes:

- Project Scope: Full-Stack Monorepo with Next.js frontend and FastAPI backend
- Tech Stack: Python 3.13+, FastAPI, SQLModel, Neon PostgreSQL, Next.js 16+, TypeScript
- Architecture: Strict separation between frontend, backend, and specs
- Authentication: Better Auth for frontend, JWT verification for backend
- API Standards: All endpoints follow `/api/{user_id}/...` pattern
- Data Isolation: All queries must filter by user_id from JWT token

The constitution was updated with new principles and the Sync Impact Report indicates the version change from 1.1.0 to 2.0.0, with several modified principles and added sections for authentication and API standards.

## Outcome

The constitution has been successfully updated to guide Phase 2 development of the full-stack monorepo application. The new version enforces the architectural constraints needed for the multi-user web application with proper authentication and data isolation.