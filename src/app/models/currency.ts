//  Third party imports
import { deserialize } from 'cerialize';

export class Currency {
  @deserialize public code: string;
  @deserialize public name: string;
  @deserialize public symbol: string;
}
