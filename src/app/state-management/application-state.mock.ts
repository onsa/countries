//  Application imports
import { ApplicationStateModel } from './application-state';
import { HighlightCountry, PickContinent } from './actions';
//  Third party imports
import { State, StateContext } from '@ngxs/store';

@State<ApplicationStateModel>({
  name: 'application',
  defaults: {
    selectedContinent: null,
    highlightedCountry: '',
    countries: []
  }
})
export class ApplicationStateMock {

  public pickContinent(_: StateContext<ApplicationStateModel>, __: PickContinent): void {}

  public highlightCountry(_: StateContext<ApplicationStateModel>, __: HighlightCountry): void {}
}
