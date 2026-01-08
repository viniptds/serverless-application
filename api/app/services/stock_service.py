from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate
from aws_lambda_powertools import Logger
from fastapi import HTTPException
from dotenv import load_dotenv
import requests
import os

load_dotenv()

logger = Logger()
api_key = os.getenv("ALPHA_API_KEY")
api_url = os.getenv("ALPHA_API_URL")

class StockService:
    def __init__(self):
        self.repo = UserRepository()

    def gainers_losers(self):
        try:
            response = self.call('GET', 'query', {'function': 'TOP_GAINERS_LOSERS', 'apikey': api_key})
            
            logger.info(response)
            return response
        except Exception as e:
            logger.error(e)
            pass
        return {}

    def search(self, search: str, limit: int = 10, offset: int = 0):
        try:
            if search == "":
                return {}
            
            response = self.call('GET', 'query', {'function': 'SYMBOL_SEARCH', 'keywords': search, 'apikey': api_key})

            logger.info(response)
            return response
        except Exception as e:
            logger.error(e)
            pass
        return {}

    def list(self, limit: int = 10, offset: int = 0):
        return self.repo.list(limit, offset)

    def get(self, stock: str):
        try:
            response = self.call('GET', 'query', {'function': 'TIME_SERIES_DAILY', 'symbol': stock, 'apikey': api_key})
            logger.info(response)
            return response
        except Exception as e:
            logger.error(e)
            pass
        return {}

    def get_by_email(self, email: str):
        return self.repo.get(email, "email")

    def update(self, user_id: str, payload: UserCreate):
        return self.repo.update(user_id, payload)

    def delete(self, user_id: str):
        self.repo.delete(user_id)

    def call(self, method, path, params):
        logger.info(api_url)
        logger.info(path)
        url = api_url + path
        logger.info(url)
        match method:
            case "POST":
                response = requests.post(url, json=params)
                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail=response.json())
                return response.json()
            case _:
                response = requests.get(url, params=params)

                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail=response.json())
                return response.json()
                # return self.repo.call(method, params)