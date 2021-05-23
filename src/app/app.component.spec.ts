//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
//  Application imports
import { AppComponent } from './app.component';
import { ApplicationStateMock } from './state-management/application-state.mock';
import { ApplicationStateModel } from './state-management/application-state';
import { Continent } from './enums/continent';
import { Country } from './models/country';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FindCountry, PickContinent } from './state-management/actions';
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
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', (): void => {
    expect(component).toBeTruthy();
  });

  it('should initialise component and not search country without fragment', (): void => {
    const navigationEnd: NavigationEnd = new NavigationEnd(1, 'some-url', 'other-url');
    component['router'] = { events: of(navigationEnd) } as any as Router;
    spyOn(component, 'findCountry');
    spyOn(component as any, 'listenToCountries');
    spyOn(component as any, 'listenToCountry');
    component.ngOnInit();
    expect(component.findCountry).not.toHaveBeenCalled();
    expect(component['listenToCountries']).toHaveBeenCalled();
    expect(component['listenToCountry']).toHaveBeenCalled();
  });

  it('should initialise component and search country with fragment', (): void => {
    const navigationEnd: NavigationEnd = new NavigationEnd(1, 'some-url', 'other-url');
    const scroll: Scroll = new Scroll(navigationEnd, [0, 0], 'NL');
    component['router'] = { events: of(scroll) } as any as Router;
    spyOn(component, 'findCountry');
    spyOn(component as any, 'listenToCountries');
    spyOn(component as any, 'listenToCountry');
    component.ngOnInit();
    expect(component.findCountry).toHaveBeenCalledWith('NL');
    expect(component['listenToCountries']).toHaveBeenCalled();
    expect(component['listenToCountry']).toHaveBeenCalled();
  });

  it('should pick continent', (): void => {
    spyOn(component['store'], 'dispatch').and.returnValue(of(null));
    spyOn(component, 'clearSelectedCountry');
    component.pickContinent(Continent.ASIA);
    expect(component['store'].dispatch).toHaveBeenCalledWith(new PickContinent(Continent.ASIA));
    expect(component.clearSelectedCountry).toHaveBeenCalled();
  });

  it('should pick country', (): void => {
    component.selectedCountry = null;
    spyOn(component['router'], 'navigate');
    const country: Country = new Country();
    country.name = 'Neverland';
    country.alpha2Code = 'NL';
    component.pickCountry(country);
    expect(component.selectedCountry).toBe(country);
    expect(component['router'].navigate).toHaveBeenCalledWith(['world'], { fragment: 'NL' });

    component['countrySelector'] = { input: { nativeElement: { value: 'Neverland' } } } as DropdownComponent;
    component.pickCountry(null);
    expect(component.selectedCountry).toBeNull();
    expect(component['router'].navigate).toHaveBeenCalledWith(['world'], { fragment: null });
    expect(component['countrySelector'].input.nativeElement.value).toBeNull();

    component.pickCountry(country);
    expect(component.selectedCountry).toBe(country);
    expect(component['router'].navigate).toHaveBeenCalledWith(['world'], { fragment: 'NL' });
    expect(component['countrySelector'].input.nativeElement.value).toBe('Neverland');
  });

  it('should find country', (): void => {
    spyOn(component['store'], 'dispatch');
    component.findCountry('NL');
    expect(component['store'].dispatch).toHaveBeenCalledWith(new FindCountry('NL'));
  });

  it('should clear selected country', (): void => {
    component.preselectedCountry = new Country();
    spyOn(component, 'pickCountry');
    component.clearSelectedCountry();
    expect(component.preselectedCountry).toBeNull();
    expect(component.pickCountry).toHaveBeenCalledWith(null);

    component['countrySelector'] = { input: { nativeElement: { value: 'Neverland' } } } as DropdownComponent;
    component.clearSelectedCountry();
    expect(component['countrySelector'].input.nativeElement.value).toBeNull();
  });

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

  it('should listen to country', waitForAsync((): void => {
    // create value to return
    const someCountry: Country = new Country();
    someCountry.capital = 'Rome';
    const otherCountry: Country = new Country();
    otherCountry.capital = 'Madrid';
    // spy on state and return twice the same array and once another
    spyOnProperty(component, 'state$', 'get').and.returnValue(
      from([
        { selectedCountry: someCountry } as ApplicationStateModel,
        { selectedCountry: someCountry } as ApplicationStateModel,
        { selectedCountry: otherCountry } as ApplicationStateModel
      ])
        .pipe(
          concatMap((state: ApplicationStateModel): Observable<ApplicationStateModel> => of(state).pipe(delay(10)))
        )
    );
    spyOn(component, 'pickCountry');
    // listen to state
    component['listenToCountry']();

    // expect selected country to change
    setTimeout( (): void => {
      expect(component.pickCountry).toHaveBeenCalledWith(someCountry);
      setTimeout( (): void => {
        expect(component.pickCountry).toHaveBeenCalledTimes(1);
        setTimeout( (): void => {
          expect(component.pickCountry).toHaveBeenCalledWith(otherCountry);
          expect(component.pickCountry).toHaveBeenCalledTimes(2);
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
