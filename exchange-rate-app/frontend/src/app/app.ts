import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Dodajemy FormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Dodaj FormsModule tutaj
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  currencies: any[] = [];
  filteredCurrencies: any[] = []; // Tablica na odfiltrowane dane
  status: string = '';
  searchTerm: string = ''; // Tu trafi tekst z wyszukiwarki

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRates();
  }

  getRates(): void {
    this.http.get<any[]>('http://localhost:8000/currencies').subscribe({
      next: (data) => {
        this.currencies = data;
        this.filterResults(); // Odśwież filtrowanie po pobraniu
      },
      error: () => { this.status = 'Błąd połączenia.'; }
    });
  }

  filterResults(): void {
    if (!this.searchTerm) {
      this.filteredCurrencies = this.currencies;
    } else {
      this.filteredCurrencies = this.currencies.filter(c =>
        c.currency.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  fetchNewData(): void {
    this.status = 'Pobieranie...';
    this.http.post('http://localhost:8000/currencies/fetch', {}).subscribe({
      next: () => {
        this.status = 'Zaktualizowano dane!';
        this.getRates();
      },
      error: () => { this.status = 'Błąd pobierania.'; }
    });
  }
}