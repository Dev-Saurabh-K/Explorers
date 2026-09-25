from fastapi import Request
from fastapi.responses import JSONResponse
import jwt

from app.core.config import settings

PUBLIC_ROUTES = [
    "/",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/auth/github",
    "/auth/github/callback",
    "/auth/logout",
]

# Prefixes whose entire sub-tree is public (Swagger UI static assets, etc.)
PUBLIC_PREFIXES = ("/docs", "/redoc", "/openapi.json")


def _is_public(path: str) -> bool:
    if path in PUBLIC_ROUTES:
        return True
    return path.startswith(PUBLIC_PREFIXES)


async def auth_middleware(request: Request, call_next):
    # Allow preflight CORS requests
    if request.method == "OPTIONS":
        return await call_next(request)

    # Allow public routes and their sub-paths
    if _is_public(request.url.path):
        return await call_next(request)

    authorization = request.headers.get("Authorization")
    if not authorization:
        return JSONResponse(
            status_code=401,
            content={"detail": "Authentication required"}
        )

    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid authorization header format. Expected 'Bearer <token>'"}
        )

    token = parts[1].strip()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        request.state.user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        return JSONResponse(
            status_code=401,
            content={"detail": "Token has expired"}
        )
    except jwt.InvalidTokenError:
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid token"}
        )
    except Exception:
        return JSONResponse(
            status_code=401,
            content={"detail": "Could not validate credentials"}
        )

    return await call_next(request)