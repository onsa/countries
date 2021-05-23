//  Angular imports
import { Component, Input, OnDestroy } from '@angular/core';
//  Application imports
import { ApplicationState, ApplicationStateModel } from '../state-management/application-state';
import { Country } from '../models/country';
import { HighlightCountry } from '../state-management/actions';
//  Third party imports
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'countries-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {

  // state listener
  @Select(ApplicationState)
  public state$: Observable<ApplicationStateModel>;

  // country currently selected
  @Input()
  public selectedCountry: Country;
  // 2-letter code of country currently hovered
  public highlightedCountry: string;

  // long-term subscriptions to be unsubscribed from when component is disposed of
  private subscriptions: Array<Subscription> = [];

  constructor(private store: Store) {
    this.subscriptions.push(
      this.state$.subscribe(
        (state: ApplicationStateModel): string => this.highlightedCountry = state.highlightedCountry
      )
    );
  }

  // send country to state reducer
  public highlightCountry(element: EventTarget): void {
    this.store.dispatch(new HighlightCountry(!!element ? (element as SVGPathElement).id : ''));
  }

  // unsubscribe from component observables
  public ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription: Subscription): void => subscription.unsubscribe()
    );
  }
}
