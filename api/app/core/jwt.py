# app/core/jwt.py
from datetime import datetime, timedelta,timezone
from typing import Dict
import jwt
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
import hashlib

from aws_lambda_powertools import Logger

logger = Logger()

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

def create_access_token(payload: Dict) -> str:
    
    to_encode = payload.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=JWT_EXPIRE_MINUTES
    )
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Dict:
    return jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM]
    )


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _prehash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def hash_password(password: str) -> str:
    # password = _prehash(password)
    # logger.info(password)
    if len(password) > 72:
        raise ValueError("Password too long")
    return pwd_context.hash(password)


def verify_password(self, plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
