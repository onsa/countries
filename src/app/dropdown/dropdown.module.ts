//  Angular imports
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
//  Application imports
import { DropdownComponent } from './dropdown.component';

@NgModule({
  declarations: [
    DropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DropdownComponent
  ]
})
export class DropdownModule { }
