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
    public selectedCountry: Country = null
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
    this.countriesService.listCountriesOf(action.continent)
      .subscribe(
        (countries: Array<Country>): void => {
          // update state with selected continent & its countries
          context.setState({
            ...previousState,
            selectedContinent: action.continent,
            countries
          });
        }
      );
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
      this.countriesService.findCountryBy(action.code)
        .subscribe(
          (country: Country): void => {
            context.setState({
              ...previousState,
              selectedCountry: country
            });
          }
        );
    }
  }
}
