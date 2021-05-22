//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//  Application imports
import { AppComponent } from './app.component';
import { ApplicationState } from './state-management/application-state';
import { Continent } from './enums/continent';
import { PickContinent } from './state-management/actions';
//  Third party imports
import { NgxsModule, Store } from '@ngxs/store';

describe('AppComponent', (): void => {
  let store: Store;
  let component: AppComponent;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([ApplicationState])
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', (): void => {
    expect(component).toBeTruthy();
  });

  it('should pick continent', (): void => {
    spyOn(component['store'], 'dispatch');
    component.pickContinent(Continent.ASIA);
    expect(component['store'].dispatch).toHaveBeenCalledWith(new PickContinent(Continent.ASIA));
  });
});
