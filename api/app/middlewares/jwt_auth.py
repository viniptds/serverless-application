# app/middlewares/jwt_auth.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from jwt import PyJWTError
from app.core.jwt import decode_access_token

PUBLIC_PATHS = {
    "/v1/auth/login",
    "/v1/auth/register",
    "/docs",
    "/openapi.json",
    "/health",
}


class JWTAuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
        
        
        path = request.url.path
        # return await call_next(request)
        
        if path in PUBLIC_PATHS:
            return await call_next(request)

        auth_header = request.headers.get("authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid Authorization header"}
            )

        token = auth_header.split(" ")[1]

        try:
            payload = decode_access_token(token)
        except PyJWTError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"}
            )

        request.state.user = payload

        return await call_next(request)
