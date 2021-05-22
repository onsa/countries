//  Angular imports
import { Injectable } from '@angular/core';
//  Application imports
import { Continent } from '../enums/continent';
import { HighlightCountry, PickContinent } from './actions';
//  Third party imports
import { Action, State, StateContext } from '@ngxs/store';

export class ApplicationStateModel {
  constructor(
    public selectedContinent: Continent = null,
    public highlightedCountry: string = ''
  ) { }
}

// state reducer to receive actions and create new application state
@State<ApplicationStateModel>({
  name: 'application',                    // unique name of state
  defaults: new ApplicationStateModel()   // default state value to begin with
})
@Injectable()
export class ApplicationState {
  // set a continent as selected
  @Action(PickContinent)
  public pickContinent(context: StateContext<ApplicationStateModel>, action: PickContinent): void {
    const previousState: ApplicationStateModel = context.getState();
    context.setState({
      ...previousState,
      selectedContinent: action.continent
    });
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
}
