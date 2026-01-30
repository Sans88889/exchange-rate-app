import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  currencies: any[] = [];
  status: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRates();
  }

  getRates(): void {
    this.http.get<any[]>('http://localhost:8000/currencies').subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (err) => {
        this.status = 'Błąd połączenia z API.';
        console.error(err);
      }
    });
  }

  fetchNewData(): void {
    this.status = 'Pobieranie...';
    this.http.post('http://localhost:8000/currencies/fetch', {}).subscribe({
      next: () => {
        this.status = 'Zaktualizowano dane!';
        this.getRates();
      },
      error: () => {
        this.status = 'Błąd pobierania danych.';
      }
    });
  }
}