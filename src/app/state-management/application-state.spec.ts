//  Application imports
import { ApplicationState, ApplicationStateModel } from './application-state';
import { Continent } from '../enums/continent';
import { PickContinent } from './actions';
//  Third party imports
import { StateContext } from '@ngxs/store';

describe('ApplicationState', (): void => {
  it('should pick continent', (): void => {
    const context: StateContext<ApplicationStateModel> = {
      getState: (): ApplicationStateModel => null,
      setState: (_: ApplicationStateModel): ApplicationStateModel => null
    } as StateContext<ApplicationStateModel>;
    spyOn(context, 'getState').and.returnValue({ selectedContinent: Continent.ASIA });
    spyOn(context, 'setState');
    const state: ApplicationState = new ApplicationState();

    state.pickContinent(context, new PickContinent(Continent.EUROPE));

    expect(context.setState).toHaveBeenCalledWith({
      selectedContinent: Continent.EUROPE
    });
  });
});
