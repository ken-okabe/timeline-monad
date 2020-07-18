interface timeline {
    type: string;
    now: any;
    next: any;
    sync: Function;
    "->": Function;
}
declare const T: (initFunction?: Function) => timeline;
export { T };
