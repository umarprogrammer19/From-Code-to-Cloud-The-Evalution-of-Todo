# Quickstart: Phase 2 Backend - Task Management API

## Prerequisites
- Python 3.13+
- uv package manager
- Access to Neon Serverless PostgreSQL database

## Setup Instructions

1. **Create the backend directory structure:**
   ```bash
   mkdir -p backend/{src/{models,schemas,services,api/v1,config},tests/{unit,integration,contract},data,alembic}
   ```

2. **Initialize the project:**
   ```bash
   cd backend
   uv init
   ```

3. **Install required dependencies using uv:**
   ```bash
   uv add fastapi uvicorn sqlmodel pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
   uv add pytest pytest-asyncio httpx --dev
   ```

4. **Set up environment variables:**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_neon_postgres_connection_string
   SECRET_KEY=your_jwt_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Create the main application file (`backend/main.py`):**
   ```python
   from fastapi import FastAPI
   from src.api.v1.tasks import router as tasks_router

   app = FastAPI(title="Task Management API")

   # Include API routes
   app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])

   @app.get("/health")
   def health_check():
       return {"status": "healthy"}
   ```

6. **Run the application:**
   ```bash
   cd backend
   uv run uvicorn main:app --reload --port 8000
   ```

## API Usage Examples

### Creating a Task
```bash
curl -X POST "http://localhost:8000/api/1/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Task", "description": "A sample task"}'
```

### Getting User's Tasks
```bash
curl -X GET "http://localhost:8000/api/1/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Updating a Task
```bash
curl -X PUT "http://localhost:8000/api/1/tasks/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "completed": true}'
```

### Deleting a Task
```bash
curl -X DELETE "http://localhost:8000/api/1/tasks/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing
Run the tests with:
```bash
cd backend
uv run pytest
```