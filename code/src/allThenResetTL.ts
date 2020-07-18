import { T } from
  "./timeline-monad.js";

interface timeline {
  type: string;
  now: any;
  next: any;
  sync: Function;
  "->": Function;
}

const left = (a: any) => (b: any) => a;
const right = (a: any) => (b: any) => b;

const replace = (arr: number[]) =>
  (index: number) =>
    (val: number) =>
      [...arr.slice(0, index), val,
      ...arr.slice(index + 1)];

const mm = (A: number[]) => (B: number[]) =>
  A.map((a, index) => a * B[index]);

const allThenResetTL =
  (TLs: timeline[]): timeline =>
    ((flagTL: timeline) =>
      T((self: timeline) => left
        (undefined)
        (right
          (
            TLs.map((TL, index) =>
              TL.sync(() =>
                ((uMask: number[]) =>
                  (target: number[]) =>
                    flagTL.next = mm(uMask)(target))
                  (TLs.map(TL =>
                    TL.now === undefined ? 0 : 1))
                  (replace(flagTL.now)(index)(1))
              )
            )
          )
          (
            flagTL.sync(
              (flags: number[]) =>
                self.next = //all  updated?
                (flags.reduce((a: number, b: number) => (a * b))
                  === 1)
                  ? left
                    (TLs.map((TL) => TL.now))
                    (flagTL.next = Array(TLs.length).fill(0))
                  : undefined//no trigger                   
            )
          )
        )
      )
    )(T((self: timeline) => Array(TLs.length).fill(0)));

export { allThenResetTL };
