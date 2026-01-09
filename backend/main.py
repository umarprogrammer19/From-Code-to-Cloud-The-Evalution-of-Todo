from fastapi import FastAPI
from src.api.v1.tasks import router as tasks_router
from src.api.v1.tasks_simple import router as tasks_simple_router
from src.api.v1.auth import router as auth_router
from src.config.settings import settings
from contextlib import asynccontextmanager
from data.database import init_db
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle application startup and shutdown events.
    """
    # Initialize the database on startup
    init_db()
    yield
    # Add any cleanup code here if needed


# Create the FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.api_version,
    debug=settings.debug,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(tasks_router, prefix="/api/{user_id}/tasks", tags=["tasks"])
app.include_router(tasks_simple_router, prefix="/api", tags=["tasks-simple"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "task-management-api"}


# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Task Management API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
