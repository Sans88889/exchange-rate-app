import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('powinien stworzyć aplikację', () => {
    expect(component).toBeTruthy();
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