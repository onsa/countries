//  Angular imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
//  Application imports
import { ApplicationState, ApplicationStateModel } from './state-management/application-state';
import { Continent } from './enums/continent';
import { Country } from './models/country';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PickContinent } from './state-management/actions';
import { Selectable } from './dropdown/selectable';
//  Third party imports
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'countries-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // hard-coded dropdown options for continents
  public readonly selectableContinents: Array<Selectable> = [
    Continent.EUROPE,
    Continent.ASIA
  ].map(
    (continent: string): Selectable => new Selectable(continent)
  );

  // list of dropdown options for countries
  public selectableCountries: Array<Selectable> = [];

  // state listener
  @Select(ApplicationState)
  public state$: Observable<ApplicationStateModel>;

  // country selector dropdown
  @ViewChild('countrySelector', { static: false })
  private countrySelector: DropdownComponent;

  private subscriptions: Array<Subscription> = [];

  constructor(private store: Store) { }

  public ngOnInit(): void {
    this.listenToCountries();
  }

  // send continent to state reducer
  public pickContinent(continent: Continent): void {
    this.subscriptions.push(
      this.store.dispatch(new PickContinent(continent))
        .subscribe(
          (): number => setTimeout( (): void => this.countrySelector.input.nativeElement.value = null )
        )
    );
  }

  // unsubscribe from component observables
  public ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription: Subscription): void => subscription.unsubscribe()
    );
  }

  // listen to state changes in selectable countries (based on continent choice)
  private listenToCountries(): void {
    this.subscriptions.push(
      this.state$
        .pipe(
          map(
            (state: ApplicationStateModel): Array<Country> => state.countries
          ),
          // stop if no change in countries
          distinctUntilChanged()
        )
        .subscribe(
          // create dropdown options
          (countries: Array<Country>): Array<Selectable> => this.selectableCountries = countries.map(
            (country: Country): Selectable => new Selectable(country.name, country)
          )
        )
    );
  }
}
