//  Application imports
import { Continent } from '../enums/continent';
import { PickContinent } from './actions';

describe('PickContinent', (): void => {
  it('should construct properly', (): void => {
    expect(PickContinent.type).toBe('PickContinent');
    const action: PickContinent = new PickContinent(Continent.ASIA);
    expect(action.continent).toBe(Continent.ASIA);
  });
});
