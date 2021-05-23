//  Angular imports
import { Injectable } from '@angular/core';
//  Application imports
import { Continent } from '../enums/continent';
import { CountriesService } from '../services/countries.service';
import { Country } from '../models/country';
import { FindCountry, HighlightCountry, PickContinent } from './actions';
//  Third party imports
import { Action, State, StateContext } from '@ngxs/store';

export class ApplicationStateModel {
  constructor(
    public selectedContinent: Continent = null,
    public highlightedCountry: string = '',
    public countries: Array<Country> = [],
    public selectedCountry: Country = null,
    public continentCache: {
      [continent: string]: Array<string>
    } = {
      [Continent.ASIA]: [],
      [Continent.EUROPE]: [],
    },
    public countryCache: { [country: string]: Country } = {}
  ) { }
}

// state reducer to receive actions and create new application state
@State<ApplicationStateModel>({
  name: 'application',                    // unique name of state
  defaults: new ApplicationStateModel()   // default state value to begin with
})
@Injectable()
export class ApplicationState {

  constructor(private countriesService: CountriesService) { }

  // set a continent as selected
  @Action(PickContinent)
  public pickContinent(context: StateContext<ApplicationStateModel>, action: PickContinent): void {
    const previousState: ApplicationStateModel = context.getState();
    // if countries of continent are already cached
    if (!!previousState.continentCache[action.continent].length) {
      // gather country codes
      const countries: Array<Country> = previousState.continentCache[action.continent]
        // map them onto countries from cache
        .map(
          (code: string): Country => previousState.countryCache[code]
        );
      // update state with selected continent & its countries
      context.setState({
        ...previousState,
        selectedContinent: action.continent,
        countries
      });
    // if countries of continent are not yet cached
    } else {
      // get countries from service
      this.countriesService.listCountriesOf(action.continent)
        .subscribe(
          (countries: Array<Country>): void => {
            // update cache
            const continentCache: {
              [continent: string]: Array<string>
            } = {
              ...previousState.continentCache,
              [action.continent]: countries.map((country: Country): string => country.alpha2Code)
            };
            const countryCache: { [country: string]: Country } = { ...previousState.countryCache };
            countries.forEach(
              (country: Country): Country => countryCache[country.alpha2Code] = country
            );
            // update state with selected continent, its countries and cache
            context.setState({
              ...previousState,
              selectedContinent: action.continent,
              countries,
              continentCache,
              countryCache
            });
          }
        );
    }
  }

  // set a country as highlighted (hovered)
  @Action(HighlightCountry)
  public highlightCountry(context: StateContext<ApplicationStateModel>, action: HighlightCountry): void {
    const previousState: ApplicationStateModel = context.getState();
    context.setState({
      ...previousState,
      highlightedCountry: action.country
    });
  }

  // set a country as selected (show details)
  @Action(FindCountry)
  public findCountry(context: StateContext<ApplicationStateModel>, action: FindCountry): void {
    const previousState: ApplicationStateModel = context.getState();
    if (!action.code) {
      context.setState({
        ...previousState,
        selectedCountry: null
      });
    } else {
      // if country is already cached
      if (!!previousState.countryCache[action.code]) {
        // update state with selected country
        context.setState({
          ...previousState,
          selectedCountry: previousState.countryCache[action.code]
        });
      // if country is not yet cached
      } else {
        // get country from service
        this.countriesService.findCountryBy(action.code)
          .subscribe(
            (country: Country): void => {
              // update cache
              const countryCache: { [country: string]: Country } = {
                ...previousState.countryCache,
                [action.code]: country
              };
              // update state with selected country and cache
              context.setState({
                ...previousState,
                selectedCountry: country,
                countryCache
              });
            }
          );
      }
    }
  }
}
