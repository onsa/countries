//  Angular imports
import { Component } from '@angular/core';
//  Application imports
import { ApplicationState, ApplicationStateModel } from './state-management/application-state';
import { Continent } from './enums/continent';
import { PickContinent } from './state-management/actions';
import { Selectable } from './dropdown/selectable';
//  Third party imports
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'countries-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // hard-coded dropdown options for continents
  public readonly selectableContinents: Array<Selectable> = [
    Continent.EUROPE,
    Continent.ASIA
  ].map(
    (continent: string): Selectable => new Selectable(continent)
  );

  // state listener
  @Select(ApplicationState)
  public state$: Observable<ApplicationStateModel>;

  constructor(private store: Store) { }

  // send continent to state reducer
  public pickContinent(continent: Continent): void {
    this.store.dispatch(new PickContinent(continent));
  }
}
