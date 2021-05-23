//  Application imports
import { Continent } from '../enums/continent';

// actions to dispatch to state reducer
export class PickContinent {
  public static readonly type: string = 'PickContinent';

  constructor(public continent: Continent) { }
}

export class HighlightCountry {
  public static readonly type: string = 'HighlightCountry';

  constructor(public country: string) { }
}

export class FindCountry {
  public static readonly type: string = 'FindCountry';

  constructor(public code: string) { }
}
