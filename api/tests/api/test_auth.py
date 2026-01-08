import pytest
import logging

logger = logging.getLogger(__name__)


def test_login_successfull(client, BASE_URL):
    payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    response = client.post(BASE_URL + "/auth/login", json=payload)
    assert response.status_code == 200

def test_registration_successfull(client, BASE_URL):
    payload = {
        "name": "test",
        "email": "user@example.com",
        "password": "123456",
        "confirm_password": "123456"
    }
    response = client.post(BASE_URL + "/auth/register", json=payload)
    assert response.status_code == 200
    assert len(response.json()) > 0


def test_token_auth_successfull(client, BASE_URL):
    payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    response = client.post(BASE_URL + "/auth/login", json=payload)

    logger.debug("Response: %s", response.json())
    token = response.json()["token"]
    logger.debug(token)
    # # client.headers.ad
    response = client.get(BASE_URL + "/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200

def test_token_fail(client, BASE_URL):
    payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    response = client.post(BASE_URL + "/auth/login", json=payload)

    token = response.json()["token"] + "1"
    response = client.get(BASE_URL + "/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401