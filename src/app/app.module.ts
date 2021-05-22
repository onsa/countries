//  Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//  Application imports
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DropdownModule } from './dropdown/dropdown.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
