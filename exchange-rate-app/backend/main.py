from fastapi import FastAPI
import requests
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Konfiguracja bazy danych PostgreSQL
DATABASE_URL = "postgresql://user:password@db:5432/currency_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model tabeli w bazie danych
class CurrencyRate(Base):
    __tablename__ = "currency_rates"
    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String)
    code = Column(String)
    mid = Column(Float)
    date = Column(Date)

# Tworzenie tabeli przy starcie aplikacji
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/currencies")
def get_currencies():
    db = SessionLocal()
    rates = db.query(CurrencyRate).all() # Pobieranie z bazy
    return rates

@app.post("/currencies/fetch")
def fetch_nbp_data():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
    response = requests.get(url) # Pobieranie z NBP
    data = response.json()[0]
    date_str = data['effectiveDate']
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    db = SessionLocal()
    for rate in data['rates']:
        new_rate = CurrencyRate(
            currency=rate['currency'],
            code=rate['code'],
            mid=rate['mid'],
            date=date_obj
        )
        db.add(new_rate) # Zapisywanie do PostgreSQL
    db.commit()
    return {"status": "Pobrano i zapisano dane z dnia " + date_str}