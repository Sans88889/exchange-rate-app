from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import requests
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta

# 1. Konfiguracja bazy danych
DATABASE_URL = "postgresql://user:password@db:5432/currency_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model danych kursu walutowego mapujący tabelę PostgreSQL
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

# Funkcja pomocnicza do sesji bazy danych (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. Konfiguracja CORS
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
def get_currencies(db: Session = Depends(get_db)):
    rates = db.query(CurrencyRate).all()
    return rates

@app.post("/currencies/fetch")
def fetch_currencies(db: Session = Depends(get_db)):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=365)
    
    current_start = start_date
    while current_start < end_date:
        current_end = min(current_start + timedelta(days=90), end_date)
        url = f"https://api.nbp.pl/api/exchangerates/tables/A/{current_start}/{current_end}/?format=json"
        
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            for table in data:
                date_val = table['effectiveDate']
                for rate in table['rates']:
                    existing = db.query(CurrencyRate).filter(
                        CurrencyRate.code == rate['code'], 
                        CurrencyRate.date == date_val
                    ).first()
                    
                    if not existing:
                        new_rate = CurrencyRate(
                            currency=rate['currency'],
                            code=rate['code'],
                            mid=rate['mid'],
                            date=date_val
                        )
                        db.add(new_rate)
            db.commit() # Zatwierdzamy każdą paczkę 90 dni
        
        current_start = current_end + timedelta(days=1)
        
    return {"status": "Dane z ostatniego roku pobrane pomyślnie"}