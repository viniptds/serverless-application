from fastapi import APIRouter, Depends, HTTPException, status
from aws_lambda_powertools import Logger
from app.models.user import UserCreate, UserResponse, UserListResponse
from app.services.user_service import UserService

logger = Logger()

router = APIRouter()

# logger.info("Request on user routes")
@router.get("/")
def list_users(service: UserService = Depends()):
    user = service.list()
    return user
@router.post("/", response_model_exclude=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, service: UserService = Depends()):
    logger.info("Request to create user")
    return service.create(payload)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, service: UserService = Depends()):
    logger.info("Request to get users")
    user = service.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, payload: UserCreate, service: UserService = Depends()):
    logger.info("Request to update users")
    return service.update(user_id, payload)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, service: UserService = Depends()):
    logger.info("Request to delete users")
    service.delete(user_id)

