//  Angular imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Event, Router, Scroll } from '@angular/router';
//  Application imports
import { ApplicationState, ApplicationStateModel } from './state-management/application-state';
import { Continent } from './enums/continent';
import { Country } from './models/country';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FindCountry, PickContinent } from './state-management/actions';
import { Selectable } from './dropdown/selectable';
//  Third party imports
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
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
  // country selected with dropdown but not confimed with load button
  public preselectedCountry: Country = null;
  // country selected and confirmed with load button
  public selectedCountry: Country = null;

  // state listener
  @Select(ApplicationState)
  public state$: Observable<ApplicationStateModel>;

  // country selector dropdown
  @ViewChild('countrySelector', { static: false })
  private countrySelector: DropdownComponent;

  // long-term subscriptions to be unsubscribed from when component is disposed of
  private subscriptions: Array<Subscription> = [];

  constructor(
    private store: Store,
    private router: Router
  ) { }

  public ngOnInit(): void {
    // check initial fragment
    this.router.events
      .pipe(
        filter(
          (event: Event): boolean => event instanceof Scroll
        )
      )
      .subscribe(
        (event: Scroll): void => this.findCountry(event.anchor)
      );
    this.listenToCountries();
    this.listenToCountry();
  }

  // send continent to state reducer
  public pickContinent(continent: Continent): void {
    this.subscriptions.push(
      this.store.dispatch(new PickContinent(continent))
        .subscribe(
          (): void => this.clearSelectedCountry()
        )
    );
  }

  // set selected country in view and update url
  public pickCountry(country: Country): void {
    this.selectedCountry = country;
    this.router.navigate(['world'], { fragment: !!country ? country.alpha2Code : null });
    // update dropdown value
    if (!!this.countrySelector) {
      this.countrySelector.input.nativeElement.value = !!country ? country.name : null;
    }
  }

  // send country code to state reducer to find corresponding country data
  public findCountry(code: string): void {
    this.store.dispatch(new FindCountry(code));
  }

  // clear view of selected country
  public clearSelectedCountry(): void {
    this.preselectedCountry = null;
    this.pickCountry(null);
    if (!!this.countrySelector) {
      // update dropdown value
      this.countrySelector.input.nativeElement.value = null;
    }
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

  // listen to state changes in selected country
  private listenToCountry(): void {
    this.subscriptions.push(
      this.state$
        .pipe(
          map(
            (state: ApplicationStateModel): Country => state.selectedCountry
          ),
          distinctUntilChanged()
        )
        .subscribe(
          (country: Country): void => this.pickCountry(country)
        )
    );
  }
}
