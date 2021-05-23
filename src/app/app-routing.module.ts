//  Angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//  Application imports
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'world', pathMatch: 'full' },
  { path: 'world', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
