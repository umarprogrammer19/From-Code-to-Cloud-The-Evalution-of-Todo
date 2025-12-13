# Skill: Phase 2 Full-Stack Development

## 1. Backend Skill (FastAPI + SQLModel)
- **File Structure**: `backend/main.py`, `backend/models.py`, `backend/routes/`.
- **Auth Middleware**: Create a dependency `get_current_user` that decodes the JWT from `Authorization: Bearer <token>`.
- **Database**: Use `SQLModel` with `DATABASE_URL` for Neon Postgres.

## 2. Frontend Skill (Next.js + Better Auth)
- **File Structure**: `frontend/app/`, `frontend/components/`, `frontend/lib/api.ts`.
- **API Client**: Create a central `api.ts` that automatically attaches the JWT token to every request.
- **Auth Setup**: Configure Better Auth with the JWT plugin enabled.

## 3. Monorepo Workflow
- Always specify which folder to work in: "In `frontend/`, do X" or "In `backend/`, do Y".