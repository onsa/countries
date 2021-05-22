//  Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//  Application imports
import { AppComponent } from './app.component';
import { ApplicationState } from './state-management/application-state';
import { AppRoutingModule } from './app-routing.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
//  Third party imports
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    NgxsModule.forRoot([ApplicationState], {
      developmentMode: !environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
