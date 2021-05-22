//  Angular imports
import { Component } from '@angular/core';
//  Application imports
import { Continent } from './enums/continent';
import { Selectable } from './dropdown/selectable';

@Component({
  selector: 'countries-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // hard-coded dropdown options for continents
  public readonly selectableContinents: Array<Selectable> = [
    Continent.EUROPE,
    Continent.ASIA
  ].map(
    (continent: string): Selectable => new Selectable(continent)
  );
}
