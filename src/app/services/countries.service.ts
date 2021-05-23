//  Angular imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//  Application imports
import { Continent } from '../enums/continent';
import { Country } from '../models/country';
import { environment } from '~/src/environments/environment';
//  Third party imports
import { first, map } from 'rxjs/operators';
import { GenericDeserialize } from 'cerialize';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  // API base url to be appended with endpoint name and parameter(s)
  protected readonly baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  // list countries of a continent
  public listCountriesOf(continent: Continent): Observable<Array<Country>> {
    // call API endpoint
    return this.http.get(`${this.baseUrl}/region/${continent}`)
      .pipe(
        // don't hold on to http observable
        first(),
        // map plain objects onto model instances
        map(
          (countries: Array<any>): Array<Country> => countries.map(
            (country: any): Country => GenericDeserialize(country, Country)
          )
        )
      );
  }
}
