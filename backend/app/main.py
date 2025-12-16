from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.init_db import init_db
from app.routers import auth, todos, messages, external, pictures, admin, photos


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚀 Starting application...")
    init_db()
    print("✅ Application ready!")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="Friend Management System",
    description="A private full-stack application for managing friend's activities",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(messages.router)
app.include_router(external.router)
app.include_router(pictures.router)
app.include_router(photos.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Friend Management System API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
