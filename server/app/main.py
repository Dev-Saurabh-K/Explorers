from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database.database import Base, engine
from app.models.user import User
from app.models.cached_responses import (
    CachedRepository,
    CachedCommit,
    CachedContributor,
    CachedContributorCommit,
    CachedRepositoryKnowledgeGraph,
    CachedFeatureKnowledgeGraph,
    CachedFeatureCategorization,
    CachedFeatureDoc
)
from app.middleware.auth_middleware import auth_middleware
from app.routes.auth_routes import router as auth_router
from app.routes.github_routes import router as github_routes
from app.routes.ai_routes import router as ai_routes
from app.routes.knowledge_routes import router as knowledge_routes
from app.routes.sync_routes import router as sync_routes

# Initialize database tables on module load to support test runners and CLI imports
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist on startup
    Base.metadata.create_all(bind=engine)
    # Ensure github_access_token column exists on existing tables
    inspector = inspect(engine)
    if "users" in inspector.get_table_names():
        columns = [col["name"] for col in inspector.get_columns("users")]
        if "github_access_token" not in columns:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN github_access_token VARCHAR"))
                conn.commit()
    yield


app = FastAPI(
    title="GitOcx API",
    lifespan=lifespan
)

# Register auth middleware FIRST so that CORSMiddleware (registered second)
# wraps it as the outermost layer — ensuring CORS headers are present even on 401 responses.
app.middleware("http")(auth_middleware)

# Allow CORS for development / frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(github_routes)
app.include_router(ai_routes)
app.include_router(knowledge_routes)
app.include_router(sync_routes)


@app.get("/", summary="Health check")
async def root():
    return {
        "message": "API is running"
    }