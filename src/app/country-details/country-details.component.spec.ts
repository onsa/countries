//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
//  Application imports
import { CountryDetailsComponent } from './country-details.component';

describe('CountryDetailsComponent', (): void => {
  let component: CountryDetailsComponent;
  let fixture: ComponentFixture<CountryDetailsComponent>;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      declarations: [ CountryDetailsComponent ]
    }).compileComponents();
  }));

  beforeEach((): void => {
    fixture = TestBed.createComponent(CountryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
