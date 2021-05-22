//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//  Application imports
import { ApplicationState } from '../state-management/application-state';
import { HighlightCountry } from '../state-management/actions';
import { MapComponent } from './map.component';
//  Third party imports
import { delay } from 'rxjs/operators';
import { NgxsModule, Store } from '@ngxs/store';
import { of, Subscription } from 'rxjs';

describe('MapComponent', (): void => {
  let store: Store;
  let component: MapComponent;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([ApplicationState])
      ],
      declarations: [
        MapComponent
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    const fixture: ComponentFixture<MapComponent> = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  }));

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should highlight country', (): void => {
    spyOn(component['store'], 'dispatch');
    component.highlightCountry({ id: 'IE' } as any as EventTarget);
    expect(component['store'].dispatch).toHaveBeenCalledWith(new HighlightCountry('IE'));

    component.highlightCountry(null);
    expect(component['store'].dispatch).toHaveBeenCalledWith(new HighlightCountry(''));
  });

  it('should unsubscribe from observables', (): void => {
    component['subscriptions'] = [];
    component.ngOnDestroy();

    component['subscriptions'] = [ of(null).pipe(delay(10)).subscribe() ];
    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeFalsy()
    );
    component.ngOnDestroy();
    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeTruthy()
    );
  });
});
