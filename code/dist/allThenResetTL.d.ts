interface timeline {
    type: string;
    now: any;
    next: any;
    sync: Function;
    "->": Function;
}
declare const allThenResetTL: (TLs: timeline[]) => timeline;
export { allThenResetTL };
