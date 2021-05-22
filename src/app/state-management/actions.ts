//  Application imports
import { Continent } from '../enums/continent';

// actions to dispatch to state reducer
export class PickContinent {
  public static readonly type: string = 'PickContinent';

  constructor(public continent: Continent) { }
}
