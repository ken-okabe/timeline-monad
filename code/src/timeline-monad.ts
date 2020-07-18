import { time } from "console";

interface timeline {
  type: string;
  now: any;
  next: any;
  sync: Function;
  "->": Function;
}

const right = (a: any) => (b: any) => b;
const third = (a: any) => (b: any) => (c: any) => c;

const log = (msg: any) => right
  (console.log(
    typeof msg === "function"
      ? msg
      : JSON.stringify(msg)))
  (msg);

const events = (observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: any) => right
    (observers.map((f: Function) => f(val)))
    (val)
});

const T = (initFunction: Function = (timeline: timeline) => undefined): timeline => {
  //immutable in the frozen universe
  const timeline = ((currentVal: any) => (ev: any) => ({
    type: "timeline-monad",  //for TTX => TX
    get now() { //getter returns a value of now
      return currentVal;
    },
    set next(nextVal: unknown) {
      //log("next:" + nextVal);
      ((currentVal = nextVal) === undefined)
        ? undefined
        : ev.trigger(currentVal);
    },
    sync: ((ev) => (f: Function) =>
      T((self: timeline) =>
        third // first, register the sync function
          (ev.register((val: unknown) =>
            ((nextVal: undefined | timeline) =>
              // RightIdentity: join = TTX => TX  
              ((nextVal !== undefined) &&
                (nextVal.type === timeline.type)
                ? nextVal.sync((val: unknown) =>
                  self.next = val)
                : (self.next = nextVal) /*&& (log(self.now))*/
              ))(f(val)))) //nextVal
          (timeline.next = timeline.now)
          //trigger the left operand on joint
          (self.now)//returns init value on joint
      ))(ev),
    "->": (f: Function) => timeline.sync(f)
  }))(undefined)(events([]));

  timeline.next = initFunction(timeline);
  //just initialization and no trigger since there's no sync yet
  return timeline;
};

export { T };