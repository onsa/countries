//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//  Application imports
import { AppComponent } from './app.component';

describe('AppComponent', (): void => {
  let component: AppComponent;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', (): void => {
    expect(component).toBeTruthy();
  });
});
