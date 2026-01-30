import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app';
import { describe, it, expect, beforeEach } from 'vitest'; // Importy z vitest

describe('AppComponent Logic Tests', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('powinien poprawnie filtrować dane po wpisaniu kodu waluty', () => {
    component.currencies = [
      { currency: 'euro', code: 'EUR', mid: 4.25, date: '2025-01-30' },
      { currency: 'dolar', code: 'USD', mid: 3.50, date: '2025-01-30' }
    ];
    component.searchTerm = 'USD';
    component.applyFilters();
    expect(component.filteredCurrencies.length).toBe(1);
    expect(component.filteredCurrencies[0].code).toBe('USD');
  });

  it('powinien zmienić status podczas pobierania danych', () => {
    component.fetchNewData();
    expect(component.status).toContain('Pobieranie');
  });
});