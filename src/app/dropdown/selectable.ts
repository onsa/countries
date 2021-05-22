// wrapper class for dropdown options
export class Selectable {

  public searchables: Array<string>;

  constructor(
    // name of element shown to user
    public display: string,
    // actual value to store and emit to consumer upon selection
    public value: any = display,
    // optional strings for easier lookup
    ...searchables: Array<string>
  ) {
    if (!!searchables.length) {
      this.searchables = searchables;
    } else {
      this.searchables = [this.display];
    }
  }
}
