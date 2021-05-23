//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//  Application imports
import { AppComponent } from './app.component';
import { ApplicationStateMock } from './state-management/application-state.mock';
import { ApplicationStateModel } from './state-management/application-state';
import { Continent } from './enums/continent';
import { Country } from './models/country';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PickContinent } from './state-management/actions';
//  Third party imports
import { concatMap, delay } from 'rxjs/operators';
import { from, Observable, of, Subscription } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';

describe('AppComponent', (): void => {
  let store: Store;
  let component: AppComponent;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([ApplicationStateMock])
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', (): void => {
    expect(component).toBeTruthy();
  });

  it('should initialise component', (): void => {
    spyOn(component as any, 'listenToCountries');
    component.ngOnInit();
    expect(component['listenToCountries']).toHaveBeenCalled();
  });

  it('should pick continent', (): void => {
    spyOn(component['store'], 'dispatch').and.returnValue(of(null));
    spyOn(component, 'clearSelectedCountry');
    component.pickContinent(Continent.ASIA);
    expect(component['store'].dispatch).toHaveBeenCalledWith(new PickContinent(Continent.ASIA));
    expect(component.clearSelectedCountry).toHaveBeenCalled();
  });

  it('should clear selected country', waitForAsync((): void => {
    component.preselectedCountry = new Country();
    component.selectedCountry = new Country();
    component.clearSelectedCountry();
    expect(component.preselectedCountry).toBeNull();
    expect(component.selectedCountry).toBeNull();

    component.selectedCountry = new Country();
    component['countrySelector'] = { input: { nativeElement: { value: 'Neverland' } } } as DropdownComponent;
    component.clearSelectedCountry();
    expect(component['countrySelector'].input.nativeElement.value).toBeNull();
    expect(component.selectedCountry).toBeNull();
  }));

  it('should listen to countries', waitForAsync((): void => {
    // create arrays to return and spy on their map method
    const someCountries: Array<Country> = [ new Country(), new Country() ];
    someCountries.first.capital = 'Rome';
    someCountries.last.capital = 'Paris';
    spyOn(someCountries, 'map').and.callThrough();
    const otherCountries: Array<Country> = [ new Country(), new Country(), new Country() ];
    otherCountries.first.capital = 'Madrid';
    otherCountries.last.capital = 'Athens';
    spyOn(otherCountries, 'map').and.callThrough();
    // spy on state and return twice the same array and once another
    spyOnProperty(component, 'state$', 'get').and.returnValue(
      from([
        { countries: someCountries } as ApplicationStateModel,
        { countries: someCountries } as ApplicationStateModel,
        { countries: otherCountries } as ApplicationStateModel
      ])
        .pipe(
          concatMap((state: ApplicationStateModel): Observable<ApplicationStateModel> => of(state).pipe(delay(10)))
        )
    );
    // listen to state
    component['listenToCountries']();

    // expect both arrays to be mapped only once
    setTimeout( (): void => {
      expect(someCountries.map).toHaveBeenCalledTimes(1);
      expect(otherCountries.map).toHaveBeenCalledTimes(0);
      expect(component.selectableCountries.length).toBe(2);
      expect(component.selectableCountries.last.value.capital).toBe('Paris');
      setTimeout( (): void => {
        expect(someCountries.map).toHaveBeenCalledTimes(1);
        expect(otherCountries.map).toHaveBeenCalledTimes(0);
        expect(component.selectableCountries.length).toBe(2);
        expect(component.selectableCountries.last.value.capital).toBe('Paris');
        setTimeout( (): void => {
          expect(someCountries.map).toHaveBeenCalledTimes(1);
          expect(otherCountries.map).toHaveBeenCalledTimes(1);
          expect(component.selectableCountries.length).toBe(3);
          expect(component.selectableCountries.last.value.capital).toBe('Athens');
        }, 12 );
      }, 12 );
    }, 12 );
  }));

  it('should unsubscribe from observables', (): void => {
    component['subscriptions'] = [];
    component.ngOnDestroy();

    component['subscriptions'] = [ of(null).pipe(delay(10)).subscribe() ];
    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeFalsy()
    );
    component.ngOnDestroy();
    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeTruthy()
    );
  });
});
