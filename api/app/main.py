from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middlewares.jwt_auth import JWTAuthMiddleware
from app.api.v1.router import router as v1_router

def create_app() -> FastAPI:
    app = FastAPI(title="Liquid Serverless API")
    app.add_middleware(JWTAuthMiddleware)
    app.include_router(v1_router, prefix="/v1")
    return app

app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)