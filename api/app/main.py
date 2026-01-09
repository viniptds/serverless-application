from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.middlewares.jwt_auth import JWTAuthMiddleware
from app.api.v1.router import router as v1_router

load_dotenv()

def create_app() -> FastAPI:
    app = FastAPI(title="Liquid Serverless API")

    app.include_router(v1_router, prefix="/v1", tags=["v1"])
    return app

app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTAuthMiddleware)