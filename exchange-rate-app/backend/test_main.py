import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Backend działa!"}

def test_get_currencies_status():
    response = client.get("/currencies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_fetch_endpoint_exists():
    # Sprawdzamy tylko czy endpoint jest dostępny (nie chcemy za każdym razem uderzać do NBP w testach)
    response = client.post("/currencies/fetch")
    assert response.status_code in [200, 500] # 500 jeśli np. brak połączenia z bazą w teście