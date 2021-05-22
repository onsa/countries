//  Application imports
import { Continent } from '../enums/continent';
import { HighlightCountry, PickContinent } from './actions';

describe('PickContinent', (): void => {
  it('should construct properly', (): void => {
    expect(PickContinent.type).toBe('PickContinent');
    const action: PickContinent = new PickContinent(Continent.ASIA);
    expect(action.continent).toBe(Continent.ASIA);
  });
});

describe('HighlightCountry', (): void => {
  it('should construct properly', (): void => {
    expect(HighlightCountry.type).toBe('HighlightCountry');
    const action: HighlightCountry = new HighlightCountry('IE');
    expect(action.country).toBe('IE');
  });
});
