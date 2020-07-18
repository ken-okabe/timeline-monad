import { T } from "./timeline-monad.js";
const left = (a) => (b) => a;
const right = (a) => (b) => b;
const replace = (arr) => (index) => (val) => [...arr.slice(0, index), val,
    ...arr.slice(index + 1)];
const mm = (A) => (B) => A.map((a, index) => a * B[index]);
const allThenResetTL = (TLs) => ((flagTL) => T((self) => left(undefined)(right(TLs.map((TL, index) => TL.sync(() => ((uMask) => (target) => flagTL.next = mm(uMask)(target))(TLs.map(TL => TL.now === undefined ? 0 : 1))(replace(flagTL.now)(index)(1)))))(flagTL.sync((flags) => self.next = //all  updated?
    (flags.reduce((a, b) => (a * b))
        === 1)
        ? left(TLs.map((TL) => TL.now))(flagTL.next = Array(TLs.length).fill(0))
        : undefined //no trigger                   
)))))(T((self) => Array(TLs.length).fill(0)));
export { allThenResetTL };
