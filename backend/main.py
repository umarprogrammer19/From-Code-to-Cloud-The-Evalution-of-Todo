from fastapi import FastAPI
from src.api.v1.tasks import router as tasks_router
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
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes - the user_id path parameter will be part of the route
app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])

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