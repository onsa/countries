//  Angular imports
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
//  Application imports
import { Continent } from '../enums/continent';
import { CountriesService } from './countries.service';
import { Country } from '../models/country';
import { Currency } from '../models/currency';
//  Third party imports
import { of } from 'rxjs';

describe('CountriesService', (): void => {
  let service: CountriesService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(CountriesService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should list countries of continent', (): void => {
    spyOn(service['http'], 'get').and.returnValue(of([{
      name: 'Neverland',
      capital: 'Jolly Roger',
      population: 99,
      currencies: [{
        code: 'G',
        name: 'gold',
        symbol: 'G'
      }],
      flag: 'skull'
    }]));
    service.listCountriesOf(Continent.EUROPE)
      .subscribe(
        (countries: Array<Country>): void => {
          expect(countries.length).toBe(1);
          expect(countries.first instanceof Country).toBeTrue();
          expect(countries.first.capital).toBe('Jolly Roger');
          expect(countries.first.currencies.length).toBe(1);
          expect(countries.first.currencies.first instanceof Currency).toBeTrue();
          expect(countries.first.currencies.first.name).toBe('gold');
        }
      );
  });

  it('should find country by code', (): void => {
    spyOn(service['http'], 'get').and.returnValue(of({
      name: 'Neverland',
      capital: 'Jolly Roger',
      population: 99,
      currencies: [{
        code: 'G',
        name: 'gold',
        symbol: 'G'
      }],
      flag: 'skull'
    }));
    service.findCountryBy('NL')
      .subscribe(
        (country: Country): void => {
          expect(country instanceof Country).toBeTrue();
          expect(country.capital).toBe('Jolly Roger');
          expect(country.currencies.length).toBe(1);
          expect(country.currencies.first instanceof Currency).toBeTrue();
          expect(country.currencies.first.name).toBe('gold');
        }
      );
  });
});
