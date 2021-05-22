//  Angular imports
import { ElementRef } from '@angular/core';

export class DropdownComponentMock {
  public input: ElementRef = new ElementRef(document.createElement('input'));
  public inputId: string = 'dropdown';
  public resetDropDownElement(): void { }
}
