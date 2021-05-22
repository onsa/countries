declare interface HTMLElement {
  clickOutside(whileCondition: () => boolean): import('rxjs').Observable<boolean>;
}
