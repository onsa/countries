//  Third party imports
import { filter, map, takeWhile } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

// add extension methods to core types
export default function extensions(): void {
  // transforms string from slug-case to camelCase
  String.prototype.slugToCamel = function (): string {
    return this.replace(
      /-([a-z&])/g, function (match: string): string { return match[1].toUpperCase(); }
    );
  };

  // accessors for first and last elements of arrays
  Array.prototype['__defineGetter__']('first', function (): any {
    return this[0];
  });

  Array.prototype['__defineSetter__']('first', function (value: any): void {
    this[0] = value;
  });

  Array.prototype['__defineGetter__']('last', function (): any {
    return this[this.length - 1];
  });

  Array.prototype['__defineSetter__']('last', function (value: any): void {
    this[this.length - 1] = value;
  });

  // syntactic sugar for array membership check
  Array.prototype.contains = function (value: any): boolean {
    return this.indexOf(value) > -1;
  };

  // convenience method for removal from array
  Array.prototype.remove = function (value: any): void {
    const index: number = this.indexOf(value);
    this.splice(index, 1);
  };

  // listens to clicks outside an HTML element
  // cancellable by while condition method and
  // further customisable by optional filters
  HTMLElement.prototype.clickOutside = function (whileCondition: () => boolean, filters: Array<() => boolean> = []): Observable<boolean> {
    let clickOutside$: Observable<MouseEvent> = (fromEvent(document, 'click') as Observable<MouseEvent>).pipe(
      takeWhile(whileCondition)
    );

    filters.forEach(
      (filterFunction: () => boolean): Observable<MouseEvent> => clickOutside$ = clickOutside$.pipe(
        filter(filterFunction)
      )
    );

    return clickOutside$
      .pipe(
        map(
          (event: MouseEvent): boolean => !this.contains(event.target as Node)
        )
      );
  };
}
