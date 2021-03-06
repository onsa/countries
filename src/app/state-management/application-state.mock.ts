//  Application imports
import { ApplicationStateModel } from './application-state';
import { Continent } from '../enums/continent';
import { FindCountry, HighlightCountry, PickContinent } from './actions';
//  Third party imports
import { State, StateContext } from '@ngxs/store';

@State<ApplicationStateModel>({
  name: 'application',
  defaults: {
    selectedContinent: null,
    highlightedCountry: '',
    countries: [],
    selectedCountry: null,
    continentCache: {
      [Continent.ASIA]: [],
      [Continent.EUROPE]: []
    },
    countryCache: {}
  }
})
export class ApplicationStateMock {

  public pickContinent(_: StateContext<ApplicationStateModel>, __: PickContinent): void {}

  public highlightCountry(_: StateContext<ApplicationStateModel>, __: HighlightCountry): void {}

  public findCountry(_: StateContext<ApplicationStateModel>, __: FindCountry): void {}
}
