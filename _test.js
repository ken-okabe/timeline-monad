import { T } from "./code/dist/timeline-monad.js";
import { allThenResetTL } from "./code/dist/allThenResetTL.js";

{
  const left = (a) => (b) => a;
  const right = (a) => (b) => b;
  const IO = {};
  IO.a = T();
  IO.b = IO.a['->']((a) => a * 2);
  IO.log = T((self) => right(self['->'](console.log))(undefined));
  IO.a.next = 3;
  IO.dummy0 = IO.b['->']((b) => IO.log.next = b);
  IO.a.next = 99;
  {
    IO.a = T((self) => 5);
    IO.b = IO.a['->']((a) => a * 2);
    IO.dummy0 = IO.b['->'](console.log);
    IO.start = T();
    // console.log(IO.start.now);
    IO.timer = T((self) =>
      left
        (undefined)
        (IO.start['->']((msg) =>
          left
            (self.next = msg)
            (setInterval(() => self.next = "ping", 1000)))));
    IO.dummy = IO.timer['->'](console.log);
    IO.start.next = "start";
  }

}

const a = T(self => 1)['->'](a => a * 2);
//const b = a['->'](a => a * 2);

a['->'](console.log);

//console.log(a.now);
//console.log(b.now);
//b['->'](console.log);