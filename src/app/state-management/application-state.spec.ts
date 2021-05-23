//  Angular imports
import { TestBed, waitForAsync } from '@angular/core/testing';
//  Application imports
import { ApplicationState, ApplicationStateModel } from './application-state';
import { Continent } from '../enums/continent';
import { CountriesService } from '../services/countries.service';
import { CountriesServiceMock } from '../services/countries.service.mock';
import { Country } from '../models/country';
import { FindCountry, HighlightCountry, PickContinent } from './actions';
//  Third party imports
import { of } from 'rxjs';
import { StateContext } from '@ngxs/store';

describe('ApplicationState', (): void => {
  let service: CountriesService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [ { provide: CountriesService, useClass: CountriesServiceMock } ]
    });
    service = TestBed.inject(CountriesService);
  });

  it('should pick continent', waitForAsync((): void => {
    const context: StateContext<ApplicationStateModel> = {
      getState: (): ApplicationStateModel => null,
      setState: (_: ApplicationStateModel): ApplicationStateModel => null
    } as StateContext<ApplicationStateModel>;
    spyOn(context, 'getState').and.returnValue({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: null
    });
    spyOn(context, 'setState');
    const country: Country = new Country();
    spyOn(service, 'listCountriesOf').and.returnValue(of([ country ]));
    const state: ApplicationState = new ApplicationState(service);

    state.pickContinent(context, new PickContinent(Continent.EUROPE));

    expect(context.setState).toHaveBeenCalledWith({
      selectedContinent: Continent.EUROPE,
      highlightedCountry: '',
      countries: [ country ],
      selectedCountry: null
    });
  }));

  it('should highlight country', (): void => {
    const context: StateContext<ApplicationStateModel> = {
      getState: (): ApplicationStateModel => null,
      setState: (_: ApplicationStateModel): ApplicationStateModel => null
    } as StateContext<ApplicationStateModel>;
    spyOn(context, 'getState').and.returnValue({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: null
    });
    spyOn(context, 'setState');
    const state: ApplicationState = new ApplicationState(service);

    state.highlightCountry(context, new HighlightCountry('IE'));

    expect(context.setState).toHaveBeenCalledWith({
      selectedContinent: Continent.ASIA,
      highlightedCountry: 'IE',
      countries: [],
      selectedCountry: null
    });
  });

  it('should find country by code', waitForAsync((): void => {
    const context: StateContext<ApplicationStateModel> = {
      getState: (): ApplicationStateModel => null,
      setState: (_: ApplicationStateModel): ApplicationStateModel => null
    } as StateContext<ApplicationStateModel>;
    spyOn(context, 'getState').and.returnValue({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: null
    });
    spyOn(context, 'setState');
    const country: Country = new Country();
    spyOn(service, 'findCountryBy').and.returnValue(of(country));
    const state: ApplicationState = new ApplicationState(service);

    state.findCountry(context, new FindCountry('NL'));

    expect(context.setState).toHaveBeenCalledWith({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: country
    });
  }));

  it('should not search for country without code', waitForAsync((): void => {
    const context: StateContext<ApplicationStateModel> = {
      getState: (): ApplicationStateModel => null,
      setState: (_: ApplicationStateModel): ApplicationStateModel => null
    } as StateContext<ApplicationStateModel>;
    spyOn(context, 'getState').and.returnValue({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: null
    });
    spyOn(context, 'setState');
    spyOn(service, 'findCountryBy');
    const state: ApplicationState = new ApplicationState(service);

    state.findCountry(context, new FindCountry(''));

    expect(service.findCountryBy).not.toHaveBeenCalled();
    expect(context.setState).toHaveBeenCalledWith({
      selectedContinent: Continent.ASIA,
      highlightedCountry: '',
      countries: [],
      selectedCountry: null
    });
  }));
});
