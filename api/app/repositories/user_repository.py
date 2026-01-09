import uuid

from app.core.jwt import hash_password
from app.models.user import UserCreate, UserResponse, UserListResponse
from app.core.db import get_dynamodb, get_users_table
from aws_lambda_powertools import Logger

logger = Logger()

dynamodb = get_dynamodb()
table = get_users_table()

res = table.attribute_definitions
print(f"Sua tabela espera estas chaves: {res}")

class UserRepository:
    def create(self, payload: UserCreate):
        item = {
            "id": str(uuid.uuid4()),
            "name": payload.name,
            "email": payload.email,
            "password": hash_password(payload.password.get_secret_value())
        }
        item.password = has
        table.put_item(Item=item)
        return item
    
    def list(self, limit: int = 10, last_key: dict = None):
        params = {"Limit": limit}
        if last_key:
            params["ExclusiveStartKey"] = last_key

        response = table.scan(**params)
        # return UserListResponse(response["Items"], response.get("LastEvaluatedKey"))
        return {
            "users": response["Items"],
            "last_key":response.get("LastEvaluatedKey")
        }

    def get(self, value: str, key="id"):
        response = table.get_item(Key={key: value})
        return response.get("Item")
    
    def get_by_email(self, email: str, key="email"):
        response = table.get_item(Key={key: email})
        return response.get("Item")

    def update(self, user_id: str, payload: UserCreate):
        item = {
            "id": user_id,
            "name": payload.name,
            "email": payload.email
        }
        table.put_item(Item=item)
        return item

    def delete(self, user_id: str):
        table.delete_item(Key={"id": user_id})
