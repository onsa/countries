declare interface Array<T> {
  first: T;
  last: T;

  contains: (value: any) => boolean;
  remove: (value: any) => void;
}
