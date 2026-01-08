from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from aws_lambda_powertools import Logger

from typing import Dict

from app.repositories.user_repository import UserRepository
from app.core.jwt import create_access_token, hash_password, verify_password
from app.models.user import UserCreate, UserResponse
from app.models.auth import LoginRequest

from traceback import format_exc

logger = Logger()

class AuthService:
    def __init__(self):
        self._fake_users_db = {
            "user@example.com": {
                "email": "user@example.com",
                "hashed_password": hash_password("123456"),
            }
        }

        try:
            self.repo = UserRepository()
        except Exception as e:
            logger.error(e)
        pass

    def login(self, payload: LoginRequest):
        try:
            is_authenticated = self.authenticate_user(
                payload.email,
                payload.password
            )

            if not is_authenticated:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            token = create_access_token({
                "email": payload.email,
                "sub": payload.email
                })

            # TODO: store token

            
            response = {
                "token": token,
                "email": payload.email
            }
        except HTTPException as e:
            logger.error(e)
            return JSONResponse(status_code=e.status_code, content={"message": e.detail})
        except Exception as e:
            logger.error(e)
            
            response = {
                "message": str(e)
            }
            return JSONResponse(status_code=400, content=response)
        return response


    def create(self, payload: UserCreate):
        try:
            if payload.password.get_secret_value() != payload.confirm_password.get_secret_value():
                raise HTTPException(status_code=400, detail="Password doesn't match")
            
            # TODO: add dynamoDB connection and test
            # user = self.repo.get_by_email(payload.email)
            # logger.info(user)

            # if user != None:
            #     raise HTTPException(status_code=400, detail="User already exists")
            
            # user = self.repo.create(payload)
            user = {
                "email": payload.email
            }

            token = create_access_token(user)
            return {
                "token": token
            }
        except Exception as e:
            logger.error(e)
            traceback_msg = format_exc()
                # Log the traceback to the console as well
            print(traceback_msg) 
            return JSONResponse(status_code=400, content={"detail": str(e)})
            pass

    def me(self, request: Request) -> UserResponse: 
        user = request.state.user
        logger.info(user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "email": user["email"],
            "user_id": user["sub"]
        }

    def authenticate_user(self, email: str, password: str) -> bool:
        user = self._fake_users_db.get(email)
        # TODO: get user from db

        if not user:
            return False
        return verify_password(self, password, user["hashed_password"])
