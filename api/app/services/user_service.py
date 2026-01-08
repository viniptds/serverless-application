from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate
from aws_lambda_powertools import Logger
from fastapi import HTTPException

logger = Logger()
class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def create(self, payload: UserCreate):
        try:
            user = self.get_by_email(payload.email)
            logger.info(user)
            if user != None:
                raise HTTPException(status_code=400, detail="User already exists")
            user = self.repo.create(payload)
            return user
        except Exception as e:
            logger.error(e)
            pass
        return {}

    def list(self, limit: int = 10, offset: int = 0):
        return self.repo.list(limit, offset)

    def get(self, user_id: str):
        return self.repo.get(user_id)

    def get_by_email(self, email: str):
        return self.repo.get(email, "email")

    def update(self, user_id: str, payload: UserCreate):
        return self.repo.update(user_id, payload)

    def delete(self, user_id: str):
        self.repo.delete(user_id)
