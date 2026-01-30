# Currency Exchange Rate Monitor (NBP API)

Aplikacja webowa typu Fullstack umożliwiająca pobieranie, archiwizowanie oraz filtrowanie kursów walut z Narodowego Banku Polskiego. Projekt realizowany w ramach przedmiotu Programowanie Zaawansowane II.

## 🚀 Technologie
* [cite_start]**Frontend:** Angular 17/18 (Standalone Components, Signals) [cite: 11]
* [cite_start]**Backend:** FastAPI (Python 3.11) [cite: 12]
* [cite_start]**Baza Danych:** PostgreSQL 15 [cite: 13]
* [cite_start]**Konteneryzacja:** Docker & Docker Compose [cite: 14]
* [cite_start]**Testy:** Pytest (Backend), Jasmine/Vitest (Frontend) [cite: 16, 17, 18]

## ✨ Funkcjonalności
* [cite_start]**Pobieranie danych historycznych:** Automatyczne zaciąganie danych z ostatnich 12 miesięcy z API NBP[cite: 8, 32].
* [cite_start]**Zaawansowane filtrowanie:** Dynamiczna filtracja wyników według waluty, roku, kwartału oraz miesiąca[cite: 50, 54].
* [cite_start]**Automatyczne testy:** Integracja testów jednostkowych z procesem budowania obrazów Docker (CI/CD)[cite: 9, 51].

## 🛠️ Instrukcja uruchomienia
Wymagany zainstalowany **Docker Desktop**.

1. Sklonuj repozytorium:
   ```bash
   git clone <link-do-twojego-repozytorium>
   cd exchange-rate-app
