from fastapi import APIRouter, Depends, HTTPException, status, Request
from aws_lambda_powertools import Logger
from app.models.user import UserResponse, UserListResponse,UserCreate
from app.models.auth import LoginRequest
from app.services.auth_service import AuthService

logger = Logger()

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest, service: AuthService = Depends()):
    login = service.login(payload)
    return login

@router.post("/register")
def register(payload: UserCreate, service: AuthService = Depends()):
    logger.info(payload)
    user = service.create(payload)
    return user

@router.get("/me")
def get_account(request: Request, service: AuthService = Depends()):
    user = service.me(request)
    return user
