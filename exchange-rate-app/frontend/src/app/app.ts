import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  currencies: any[] = [];
  filteredCurrencies: any[] = [];
  status: string = '';
  searchTerm: string = '';
  
  // Opcje filtrów czasowych
  selectedYear: string = 'Wszystkie';
  selectedQuarter: string = 'Wszystkie';
  selectedMonth: string = 'Wszystkie';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRates();
  }

  getRates(): void {
    this.http.get<any[]>('http://localhost:8000/currencies').subscribe({
      next: (data) => {
        this.currencies = data;
        this.applyFilters();
      },
      error: () => { this.status = 'Błąd połączenia z backendem.'; }
    });
  }

  // Główna funkcja filtrująca spełniająca wymagania projektowe
  applyFilters(): void {
    this.filteredCurrencies = this.currencies.filter(rate => {
      const rateDate = new Date(rate.date);
      const year = rateDate.getFullYear().toString();
      const month = (rateDate.getMonth() + 1); // Miesiące są 0-11
      const quarter = Math.ceil(month / 3).toString();

      // Filtracja tekstowa (nazwa/kod)
      const matchesSearch = rate.currency.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            rate.code.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtracja czasowa
      const matchesYear = this.selectedYear === 'Wszystkie' || year === this.selectedYear;
      const matchesQuarter = this.selectedQuarter === 'Wszystkie' || quarter === this.selectedQuarter;
      const matchesMonth = this.selectedMonth === 'Wszystkie' || month.toString() === this.selectedMonth;

      return matchesSearch && matchesYear && matchesQuarter && matchesMonth;
    });
  }

  fetchNewData(): void {
    this.status = 'Pobieranie danych z ostatniego roku (może to potrwać)...';
    this.http.post('http://localhost:8000/currencies/fetch', {}).subscribe({
      next: () => {
        this.status = 'Zaktualizowano bazę o dane historyczne!';
        this.getRates();
      },
      error: () => { this.status = 'Błąd pobierania danych z API NBP.'; }
    });
  }
}