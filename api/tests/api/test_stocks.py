import pytest

def test_stocks_list(logged_client, BASE_URL):
    response = logged_client.get(BASE_URL + "/stocks")

    assert response.status_code == 422

def test_stocks_list_with_params(logged_client, BASE_URL):
    response = logged_client.get(BASE_URL + "/stocks", params={"search": "AAPL"})
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_stocks_get(logged_client, BASE_URL):
    response = logged_client.get(BASE_URL + "/stocks/AAPL")
    assert response.status_code == 200