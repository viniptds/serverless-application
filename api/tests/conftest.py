import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.main import create_app

app = create_app()

@pytest.fixture
def BASE_URL(): return "http://localhost/v1"

@pytest.fixture
def client():
    return TestClient(app, headers={"Content-Type": "application/json"})


@pytest.fixture
def logged_client(BASE_URL):
    client = TestClient(app, headers={"Content-Type": "application/json"})
    payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    response = client.post(BASE_URL + "/auth/login", json=payload)
    token = response.json()["token"]
    return TestClient(app, headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
