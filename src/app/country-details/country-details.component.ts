//  Angular imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
//  Application imports
import { Country } from '../models/country';

@Component({
  selector: 'countries-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent {

  // country to display
  @Input()
  public country: Country;

  // event for closing details
  @Output()
  public closeEvent: EventEmitter<void> = new EventEmitter<void>();
}
