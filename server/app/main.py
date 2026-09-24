from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import inspect, text

from app.database.database import Base, engine
from app.models.user import User  # Ensure User model is registered
from app.middleware.auth_middleware import auth_middleware
from app.routes.auth_routes import router as auth_router
from app.routes.github_routes import router as github_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
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
    title="Hacknex API",
    lifespan=lifespan
)

# Allow CORS for development / frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(auth_middleware)

app.include_router(auth_router)
app.include_router(github_routes)


@app.get("/", summary="Health check")
async def root():
    return {
        "message": "API is running"
    }