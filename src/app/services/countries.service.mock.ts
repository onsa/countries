//  Application imports
import { Continent } from '../enums/continent';
import { Country } from '../models/country';
//  Third party imports
import { Observable, of } from 'rxjs';

export class CountriesServiceMock {

  protected readonly baseUrl: string = 'test-url';

  public listCountriesOf(_: Continent): Observable<Array<Country>> {
    return of([]);
  }

  public findCountryBy(_: string): Observable<Country> {
    return of(null);
  }
}
