from fastapi import APIRouter
from app.api.v1.users import router as users_router
from app.api.v1.stocks import router as stocks_router
from app.api.v1.auth import router as auth_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(stocks_router, prefix="/stocks", tags=["stocks"])