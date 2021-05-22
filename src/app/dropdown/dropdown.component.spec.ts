//  Angular imports
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ElementRef, NO_ERRORS_SCHEMA, QueryList, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
//  Application imports
import { DOMUtilsService } from './dom-utils.service';
import { DOMUtilsServiceMock } from './dom-utils.service.mock';
import { DropdownComponent } from './dropdown.component';
import { Selectable } from './selectable';
//  Third party imports
import { delay } from 'rxjs/operators';
import { Key } from 'ts-key-enum';
import { Observable, of, Subject, Subscription } from 'rxjs';

describe('DropdownComponent', (): void => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(waitForAsync((): void => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DropdownComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DOMUtilsService, useClass: DOMUtilsServiceMock }]
    })
      .compileComponents();
  }));

  beforeEach((): void => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    component.inputId = 'test-dropdown';
    component['elements'] = [
      new Selectable('a', 'b', 'c'),
      new Selectable('d', 'e', 'f'),
      new Selectable('g', 'h', 'i')
    ];
  });

  afterEach((): void => {
    component['subscriptions'].forEach(
      (subscription: Subscription): void => subscription.unsubscribe()
    );
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to clicks and keyups', (): void => {
    spyOn(component as any, 'initLookupMap');
    spyOn(component as any, 'filterList');
    component.ngAfterContentInit();
    expect(component['initLookupMap']).toHaveBeenCalled();
    expect(component['filterList']).toHaveBeenCalledWith(null);
    expect(component['subscriptions'].length).toBe(2);
  });

  it('should update input value and list', waitForAsync((): void => {
    const display: string = 'title';
    const value: string = 'value';
    const selectable: Selectable = new Selectable(display, value, 'search-expression');
    component['elements'] = [selectable];
    component.value = value;

    component.ngOnChanges({
      elements: new SimpleChange([], [selectable], false),
      value: new SimpleChange('else', value, false)
    });

    setTimeout((): void => {
      expect(component.filterExpression).toEqual(display);
      expect(component.filteredElements.length).toBe(1);
    });

    component.ngOnChanges({});

    setTimeout((): void => {
      expect(component.filterExpression).toEqual(display);
      expect(component.filteredElements.length).toBe(1);
    });
  }));

  it('should tell if the dropdown is open', (): void => {
    component.open = false;
    expect(component.isOpen()).toBeFalsy();
    component.open = true;
    expect(component.isOpen()).toBeTruthy();
  });

  it('should not select if element is not found', (): void => {
    spyOn(component, 'select');
    component['elements'] = [new Selectable('abcdef'), new Selectable('defghi')];
    component.filteredElements = [];
    component.enter();
    expect(component.select).not.toHaveBeenCalled();
  });

  it('should not select if filtered list several items', (): void => {
    spyOn(component, 'select');
    component['elements'] = [new Selectable('abcdef'), new Selectable('defghi')];
    component.filteredElements = [new Selectable('abcdef'), new Selectable('defghi')];
    component.enter();
    expect(component.select).not.toHaveBeenCalled();
  });

  it('should select element matching the only value of filtered elements', (): void => {
    spyOn(component, 'select');
    component['elements'] = [new Selectable('abcdef'), new Selectable('defghi')];
    component.filteredElements = [new Selectable('abcdef')];
    component.enter();
    expect(component.select).toHaveBeenCalledWith(new Selectable('abcdef'));
  });

  it('should select a list item', (): void => {
    spyOn(component as any, 'filterList');
    spyOn(component['selectElement'], 'emit');

    component.open = true;
    component.select(new Selectable('Easily readable name', 'value', 'this', 'that'));

    expect(component.open).toBeFalsy();
    expect(component.input.nativeElement.value).toBe('Easily readable name');
    expect(component['filterList']).toHaveBeenCalledWith(null);
    expect(component['selectElement'].emit).toHaveBeenCalledWith('value');

    component.open = true;
    component.select(
      new Selectable('Easily readable name', 'value', 'this', 'that'),
      { stopPropagation: (): void => { } } as MouseEvent
    );
    fixture.detectChanges();
  });

  it('should react to keydowns appropriately', (): void => {
    const enter: KeyboardEvent = { code: Key.Enter, preventDefault: function (): void { } } as any as KeyboardEvent;
    const escape: KeyboardEvent = { code: Key.Escape, preventDefault: function (): void { } } as any as KeyboardEvent;
    const down: KeyboardEvent = { code: Key.ArrowDown, preventDefault: function (): void { } } as any as KeyboardEvent;

    spyOn(component, 'select');
    spyOn(component as any, 'closeDropdown');
    spyOn(component as any, 'proceedInList');

    const selectable: Selectable = new Selectable('something');
    component.onKeydown({} as any, selectable);

    expect(component.select).not.toHaveBeenCalled();
    expect(component['closeDropdown']).not.toHaveBeenCalled();
    expect(component['proceedInList']).not.toHaveBeenCalled();

    component.onKeydown(enter, selectable);
    expect(component.select).toHaveBeenCalledWith(selectable);

    expect(component['closeDropdown']).not.toHaveBeenCalled();
    component.onKeydown(escape, selectable);
    expect(component.open).toBeFalsy();
    expect(component['closeDropdown']).toHaveBeenCalled();

    expect(component['proceedInList']).not.toHaveBeenCalled();
    component.onKeydown(down, 'value');
    expect(component['proceedInList']).toHaveBeenCalledWith(down);
  });

  it('should reset dropdown element', waitForAsync((): void => {
    spyOn(component as any, 'setDimensionsAndPosition');
    spyOn(component as any, 'closeDropdown');
    spyOn(component as any, 'openDropdown');
    component.open = true;
    component.dropUp = true;
    component['previousDropUp'] = false;

    component.resetDropDownElement();

    expect(component['setDimensionsAndPosition']).toHaveBeenCalledWith(component['dropDownContainer'].nativeElement);
    expect(component['closeDropdown']).toHaveBeenCalledTimes(1);

    component.open = false;
    component.resetDropDownElement();
    expect(component['closeDropdown']).toHaveBeenCalledTimes(1);
  }));

  it('should unsubscribe from listeners', (): void => {
    component['subscriptions'] = [
      of(null).pipe(delay(200)).subscribe(),
      of(null).pipe(delay(300)).subscribe()
    ];

    component.ngOnDestroy();

    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeTruthy()
    );

    component['subscriptions'] = [];
    component.ngOnDestroy();

    component['subscriptions'].forEach(
      (subscription: Subscription): boolean => expect(subscription.closed).toBeTruthy()
    );
  });

  it('should set string value', waitForAsync((): void => {
    component.filterExpression = null;

    component['elements'] = [
      new Selectable('selected display', 1)
    ];
    component.value = '1';
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBe('selected display');
    });
  }));

  it('should set false value', waitForAsync((): void => {
    component.filterExpression = null;

    component['elements'] = [
      new Selectable('No', false)
    ];
    (component.value as any) = false;
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBe('No');
    });
  }));

  it('should set zero value', waitForAsync((): void => {
    component.filterExpression = null;

    component['elements'] = [
      new Selectable('None', 0)
    ];
    (component.value as any) = 0;
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBe('None');
    });
  }));

  it('should set case insensitive value', waitForAsync((): void => {
    component.filterExpression = null;

    component['elements'] = [
      new Selectable('Selected Display', 'Selected Value')
    ];
    component.value = 'selected value';
    component['caseSensitive'] = false;
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBe('Selected Display');
    });
  }));

  it('should set object value', waitForAsync((): void => {
    class DummyClass {
      constructor(public text: string, public figure: number) { }
    }
    component.filterExpression = null;

    const value: DummyClass = { figure: 3, text: 'dummy-text' };
    component['elements'] = [
      new Selectable('Selected Display', value)
    ];
    component.value = new DummyClass('dummy-text', 3);
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toEqual('Selected Display');
    });
  }));

  it('should not set non-existent value', waitForAsync((): void => {
    component.filterExpression = null;

    (component.value as any) = '';
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBeNull();
    });
  }));

  it('should not set not found value', waitForAsync((): void => {
    component.filterExpression = null;

    component['elements'] = [
      new Selectable('Selected Display', 'Selected Value')
    ];

    (component.value as any) = 'Not found value';
    component['setValue']();
    setTimeout((): void => {
      expect(component['filterExpression']).toBeNull();
    });
  }));

  it('should initialise the lookup map', (): void => {
    component['elements'].push(
      new Selectable('display', 'value', 'I')
    );
    component['lookupMap'] = {};
    component['initLookupMap']();
    expect(component['lookupMap'].i.length).toBe(2);
  });

  it('should filter list', (): void => {
    spyOn(component as any, 'filterByDisplay').and.returnValues(
      [component['elements'][1]],
      []
    );
    spyOn(component as any, 'closeDropdown');
    component.filteredElements = component['elements'];
    expect(component.filteredElements.length).toBe(3);
    component['filterList']('f');
    expect(component.filteredElements.length).toBe(1);
    expect(component['filterByDisplay']).toHaveBeenCalledWith('f');
    expect(component['closeDropdown']).not.toHaveBeenCalled();
    component['filterList']('J');
    expect(component['filterByDisplay']).toHaveBeenCalledWith('j');
    expect(component['closeDropdown']).toHaveBeenCalled();
  });

  it('should filter by display', (): void => {
    expect(component['filterByDisplay']('a').length).toBe(1);
    expect(component['filterByDisplay']('a').first.value).toBe('b');
  });

  it('should initialise filtered set', (): void => {
    component.filteredElements = [
      new Selectable('display', 'value')
    ];
    expect(component['initFilteredSet']()).toEqual(new Set<string>(['display']));
  });

  it('should filter by searchables', (): void => {
    component.filteredElements = [];
    component['lookupMap'] = {
      c: [component['elements'][0]],
      f: [component['elements'][1]],
      i: [component['elements'][2]]
    };
    const filteredSet: Set<string> = new Set<string>(['c', 'f', 'i']);
    component['filterBySearchables']('f', filteredSet);
    expect(component.filteredElements).toEqual([component['elements'][1]]);
  });

  it('should open dropdown if it is not already open', (): void => {
    spyOn(component as any, 'initDropDownListener');
    spyOn(component as any, 'setDimensionsAndPosition');
    spyOn(component as any, 'subscribeToClickOutside').and.returnValue(null);
    spyOn(component as any, 'subscribeToInputKeydown').and.returnValue(null);
    spyOn(component['subscriptions'], 'push');
    component.filteredElements = component['elements'];
    const container: HTMLElement = document.createElement('div');
    component['dropDownContainer'] = new ElementRef(container);
    component.open = false;
    component['openDropdown']();
    expect(component['initDropDownListener']).toHaveBeenCalled();
    expect(component['setDimensionsAndPosition']).toHaveBeenCalledWith(container);
    expect(component['subscribeToClickOutside']).toHaveBeenCalled();
    expect(component['subscribeToInputKeydown']).toHaveBeenCalled();
    expect(component['subscriptions'].push).toHaveBeenCalledTimes(2);
  });

  it('should not open dropdown if it is already open', (): void => {
    spyOn(component as any, 'initDropDownListener');
    spyOn(component as any, 'setDimensionsAndPosition');
    component.filteredElements = component['elements'];
    component.open = true;
    component['openDropdown']();
    expect(component['initDropDownListener']).not.toHaveBeenCalled();
    expect(component['setDimensionsAndPosition']).not.toHaveBeenCalled();
  });

  it('should close dropdown if it is not already closed', (): void => {
    spyOn(component as any, 'destroyDropDownListener');
    component.open = true;
    component['closeDropdown']();
    expect(component.open).toBeFalsy();
    expect(component.visibility).toBe('hidden');
    expect(component['destroyDropDownListener']).toHaveBeenCalled();
  });

  it('should not close dropdown if it is already closed', (): void => {
    spyOn(component as any, 'destroyDropDownListener');
    component.open = false;
    component['closeDropdown']();
    expect(component['destroyDropDownListener']).not.toHaveBeenCalled();
  });

  it('should initialise dropdown listener', waitForAsync((): void => {
    spyOn(component as any, 'destroyDropDownListener');
    spyOn(component, 'resetDropDownElement');
    component['initDropDownListener']();
    expect(component['destroyDropDownListener']).toHaveBeenCalled();

    component['domUtilsService']['fakeScroll']();
    setTimeout(
      (): boolean => expect(component.resetDropDownElement).toHaveBeenCalled(),
      component['debounce']
    );
  }));

  it('should calculate dimensions and position', (): void => {
    component.dropUp = true;
    component['previousDropUp'] = false;
    spyOn(component as any, 'closeDropdown');

    component['setDimensionsAndPosition']({ getBoundingClientRect: (): any => ({ top: -10 }) } as HTMLElement);
    expect(component['closeDropdown']).toHaveBeenCalled();
    expect(component['previousDropUp']).toBe(true);
    expect(component['dropUp']).toBe(false);

    component['setDimensionsAndPosition']({ getBoundingClientRect: (): any => ({ top: 10, bottom: 10, width: 30 }) } as HTMLElement);
    expect(component.dropDownMaxHeight).toBe(window.innerHeight - 10 - 20);
  });

  it('should subscribe to input down arrow keydown', waitForAsync((): void => {
    component.filteredElements = component['elements'];
    component['filteredDOMElements'] = { toArray: (): Array<any> => [] } as QueryList<ElementRef>;
    component.open = true;
    const event: KeyboardEvent = { code: Key.ArrowDown, preventDefault: (): void => { } } as KeyboardEvent;
    component['keyDown$'] = of(event);
    spyOn(event, 'preventDefault');
    const focusedElement: HTMLElement = document.createElement('li');
    spyOn(focusedElement, 'focus');
    spyOn(component['filteredDOMElements'], 'toArray').and.returnValue(
      [
        new ElementRef(focusedElement),
        new ElementRef(null),
        new ElementRef(null)
      ]
    );
    component['subscribeToInputKeydown']();
    setTimeout((): void => {
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['filteredDOMElements'].toArray).toHaveBeenCalled();
      expect(focusedElement.focus).toHaveBeenCalled();
    });
  }));

  it('should subscribe to input up arrow keydown', waitForAsync((): void => {
    component.filteredElements = component['elements'];
    component['filteredDOMElements'] = { toArray: (): Array<any> => [] } as QueryList<ElementRef>;
    component.open = true;
    const event: KeyboardEvent = { code: Key.ArrowUp, preventDefault: (): void => { } } as KeyboardEvent;
    component['keyDown$'] = of(event);
    spyOn(event, 'preventDefault');
    const focusedElement: HTMLElement = document.createElement('li');
    spyOn(focusedElement, 'focus');
    spyOn(component['filteredDOMElements'], 'toArray').and.returnValues(
      [
        new ElementRef(null),
        new ElementRef(null),
        new ElementRef(focusedElement)
      ]
    );
    component['subscribeToInputKeydown']();
    setTimeout((): void => {
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['filteredDOMElements'].toArray).toHaveBeenCalled();
      expect(focusedElement.focus).toHaveBeenCalled();
    });
  }));

  it('should subscribe to input escape keyup', waitForAsync((): void => {
    spyOn(component as any, 'closeDropdown');
    component['keyUp$'] = of({ code: Key.Escape } as KeyboardEvent);
    component['subscribeToInputKeyup']();
    setTimeout((): void => {
      expect(component['closeDropdown']).toHaveBeenCalled();
    }, component['delay']);
  }));

  it('should subscribe to input enter keyup', waitForAsync((): void => {
    spyOn(component as any, 'closeDropdown');
    spyOn(component['freeHand'], 'emit');
    spyOn(component as any, 'filterList');
    component.input.nativeElement.value = 'value';
    component['keyUp$'] = of({ code: Key.Enter } as KeyboardEvent);
    component['subscribeToInputKeyup']();
    setTimeout((): void => {
      expect(component['freeHand'].emit).toHaveBeenCalledWith('value');
      expect(component.input.nativeElement.value).toBe('value');
      expect(component['filterList']).toHaveBeenCalledWith(null);
      expect(component['closeDropdown']).toHaveBeenCalled();
    }, component['delay']);
  }));

  it('should subscribe to other input keyups', waitForAsync((): void => {
    spyOn(component as any, 'openDropdown');
    component['keyUp$'] = of({ code: 'k' } as KeyboardEvent);
    component['subscribeToInputKeyup']();
    setTimeout((): void => {
      expect(component['openDropdown']).toHaveBeenCalled();
    }, component['delay']);
  }));

  it('should subscribe to arrow input keyups', waitForAsync((): void => {
    spyOn(component as any, 'openDropdown');
    component['keyUp$'] = of({ code: Key.ArrowLeft } as KeyboardEvent);
    component['subscribeToInputKeyup']();
    setTimeout((): void => {
      expect(component['openDropdown']).not.toHaveBeenCalled();
    }, component['delay']);
  }));

  it('should filter identical input keyups', waitForAsync((): void => {
    spyOn(component as any, 'openDropdown');
    spyOn(component as any, 'filterList');
    component.filteredElements = component['elements'];
    const subject: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    component['keyUp$'] = subject.asObservable();
    component['subscribeToInputKeyup']();
    subject.next(({ code: 'a' } as KeyboardEvent));
    component.filterExpression = 'A';
    setTimeout((): void => {
      expect(component['filterList']).toHaveBeenCalledTimes(1);
      expect(component['openDropdown']).toHaveBeenCalledTimes(1);
      subject.next(({ code: Key.ArrowLeft } as KeyboardEvent));
      setTimeout((): void => {
        expect(component['filterList']).toHaveBeenCalledTimes(1);
        expect(component['openDropdown']).toHaveBeenCalledTimes(1);
      }, component['delay'] + 100);   // add 100ms for extra setTimeout in subscription
    }, component['delay'] + 100);
  }));

  it('should subscribe to input click', (): void => {
    spyOn(component as any, 'openDropdown');
    component.open = true;
    component['inputClick$'] = of({} as MouseEvent);
    component['subscribeToInputClick']();
    expect(component['openDropdown']).not.toHaveBeenCalled();
    component.open = false;
    component['inputClick$'] = of({} as MouseEvent);
    component['subscribeToInputClick']();
    expect(component['openDropdown']).toHaveBeenCalled();
  });

  it('should close dropdown to click outside', (): void => {
    spyOn(component as any, 'closeDropdown');
    component.open = true;
    component['host'].nativeElement.clickOutside = (): Observable<boolean> => of(false, true);
    component['subscribeToClickOutside']();
    expect(component['closeDropdown']).toHaveBeenCalledTimes(1);
  });

  it('should not close dropdown to click inside', (): void => {
    spyOn(component as any, 'closeDropdown');
    component.open = true;
    const target: Element = (component['host'].nativeElement as HTMLElement).firstElementChild;
    component['clickOutside$'] = of({ target: target as EventTarget } as MouseEvent);
    component['subscribeToClickOutside']();
    expect(component['closeDropdown']).not.toHaveBeenCalled();
  });

  it('should proceed in list', (): void => {
    spyOn(component as any, 'focusNext');
    spyOn(component as any, 'focusPrevious');

    const target: HTMLElement = document.createElement('div');
    component['proceedInList']({
      target: target as HTMLElement,
      code: Key.ArrowDown,
      preventDefault: (): void => { }
    } as any as KeyboardEvent);
    expect(component['focusNext']).toHaveBeenCalledWith(target);

    component['proceedInList']({
      target: target as HTMLElement,
      code: Key.ArrowUp,
      preventDefault: (): void => { }
    } as any as KeyboardEvent);
    expect(component['focusPrevious']).toHaveBeenCalledWith(target);
  });

  it('should focus next when there is next', (): void => {
    const container: HTMLDivElement = document.createElement('div');
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    spyOn(container.firstElementChild.nextElementSibling as HTMLElement, 'focus');

    component['focusNext'](container.firstElementChild as HTMLElement);
    expect((container.firstElementChild.nextElementSibling as HTMLElement).focus).toHaveBeenCalled();
  });

  it('should focus next when there is no next', (): void => {
    const container: HTMLDivElement = document.createElement('div');
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    spyOn(container.firstElementChild as HTMLElement, 'focus');

    component['focusNext'](container.lastElementChild as HTMLElement);
    expect((container.firstElementChild as HTMLElement).focus).toHaveBeenCalled();
  });

  it('should focus previous when there is previous', (): void => {
    const container: HTMLDivElement = document.createElement('div');
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    spyOn(container.lastElementChild.previousElementSibling as HTMLElement, 'focus');

    component['focusPrevious'](container.lastElementChild as HTMLElement);
    expect((container.lastElementChild.previousElementSibling as HTMLElement).focus).toHaveBeenCalled();
  });

  it('should focus previous when there is no previous', (): void => {
    const container: HTMLDivElement = document.createElement('div');
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    container.appendChild(document.createElement('div'));
    spyOn(container.lastElementChild as HTMLElement, 'focus');

    component['focusPrevious'](container.firstElementChild as HTMLElement);
    expect((container.lastElementChild as HTMLElement).focus).toHaveBeenCalled();
  });
});
