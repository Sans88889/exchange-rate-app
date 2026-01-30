import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currencies: any[] = [];
  status: string = '';

  constructor(private http: HttpClient) {}

  // Funkcja pobierająca dane z Twojego API
  getRates() {
    this.http.get<any[]>('http://localhost:8000/currencies').subscribe(data => {
      this.currencies = data;
    });
  }

  // Funkcja zlecająca backendowi pobranie nowych danych z NBP
  fetchNewData() {
    this.status = 'Pobieranie...';
    this.http.post('http://localhost:8000/currencies/fetch', {}).subscribe(() => {
      this.status = 'Dane zaktualizowane!';
      this.getRates(); // Odśwież listę
    });
  }
}