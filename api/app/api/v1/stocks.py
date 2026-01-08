from fastapi import APIRouter, Depends, HTTPException, status
from aws_lambda_powertools import Logger
from app.models.user import UserCreate, UserResponse, UserListResponse
from app.services.stock_service import StockService

logger = Logger()

router = APIRouter()

@router.get("/")
def list_stocks(search: str, service: StockService = Depends()):
    stocks = service.search(search)
    return stocks

@router.get("/top_stocks")
def list_stocks(service: StockService = Depends()):
    stocks = service.gainers_losers()
    return stocks

# @router.post("/", response_model_exclude=UserResponse, status_code=status.HTTP_201_CREATED)
# def create_user(payload: UserCreate, service: StockService = Depends()):
#     logger.info("Request to create user")
#     return service.create(payload)

@router.get("/{stock}")
def get_user(stock: str, service: StockService = Depends()):
    logger.info("Request to get stock")
    user = service.get(stock)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# @router.put("/{user_id}", response_model=UserResponse)
# def update_user(user_id: str, payload: UserCreate, service: StockService = Depends()):
#     logger.info("Request to update users")
#     return service.update(user_id, payload)

# @router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_user(user_id: str, service: StockService = Depends()):
#     logger.info("Request to delete users")
#     service.delete(user_id)

