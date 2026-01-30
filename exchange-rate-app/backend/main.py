from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# 1. Poprawny URL do bazy danych (poprawione ukośniki)
DATABASE_URL = "postgresql://user:password@db:5432/currency_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Model bazy danych
class CurrencyRate(Base):
    __tablename__ = "currency_rates"
    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String)
    code = Column(String)
    mid = Column(Float)
    date = Column(Date)

# Tworzenie tabeli
Base.metadata.create_all(bind=engine)

app = FastAPI()

# 3. Pełna konfiguracja CORS (bardzo ważne dla Angulara!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend działa!"}

@app.get("/currencies")
def get_currencies():
    db = SessionLocal()
    try:
        rates = db.query(CurrencyRate).all() # Pobieranie z bazy
        return rates
    finally:
        db.close()

@app.post("/currencies/fetch")
def fetch_nbp_data():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
    response = requests.get(url) # Pobieranie z NBP
    data = response.json()[0]
    date_obj = datetime.strptime(data['effectiveDate'], '%Y-%m-%d').date()
    
    db = SessionLocal()
    try:
        db.query(CurrencyRate).delete() # Czyścimy stare dane
        for rate in data['rates']:
            new_rate = CurrencyRate(
                currency=rate['currency'],
                code=rate['code'],
                mid=rate['mid'],
                date=date_obj
            )
            db.add(new_rate)
        db.commit()
        return {"status": "Success"}
    finally:
        db.close()