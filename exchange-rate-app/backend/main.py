from fastapi import FastAPI
import requests

app = FastAPI()

# Wymagany endpoint: GET /currencies
@app.get("/currencies")
def get_currencies():
    # Tu później dodamy pobieranie z bazy danych PostgreSQL
    return {"message": "Lista walut z bazy danych"}

# Wymagany endpoint: POST /currencies/fetch
@app.post("/currencies/fetch")
def fetch_nbp_data():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
    response = requests.get(url) # Pobieranie z NBP
    data = response.json()
    # Tu dodamy kod zapisujący dane do Postgresa
    return {"status": "success", "data": data}