# Task Management API Backend

This is the backend service for the Task Management application, built with FastAPI and SQLModel.

## Features

- JWT-based authentication and authorization
- User data isolation (users can only access their own tasks)
- Full CRUD operations for tasks
- Task priority management (low, medium, high, urgent)
- RESTful API design
- PostgreSQL database with SQLModel ORM

## Endpoints

All endpoints follow the pattern `/api/{user_id}/...` where `user_id` must match the user_id in the JWT token.

- `POST /api/{user_id}/tasks` - Create a new task (supports priority field)
- `GET /api/{user_id}/tasks` - Get all tasks for a user (supports priority filtering with ?priority=high)
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task (supports priority updates)
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task

## Requirements

- Python 3.13+
- uv package manager
- PostgreSQL database (Neon Serverless recommended)

## Setup

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run the application:
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT expiration time (default: 30)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Development

To run tests:
```bash
uv run pytest
```

## API Documentation
The API documentation is automatically available at `/docs` when the server is running.