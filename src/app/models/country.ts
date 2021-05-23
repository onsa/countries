//  Application imports
import { Currency } from './currency';
//  Third party imports
import { deserialize, deserializeAs } from 'cerialize';

export class Country {
  @deserialize public name: string;
  @deserialize public alpha2Code: string;
  @deserialize public capital: string;
  @deserialize public population: number;
  @deserializeAs(Currency) public currencies: Array<Currency>;
  @deserialize public flag: string;
}
