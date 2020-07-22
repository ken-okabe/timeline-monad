interface timeline {
  type: string;
  now: any;
  next: any;
  sync: Function;
  "->": Function;
}

const third = (a: any) => (b: any) => (c: any) => c;

const log = (msg: unknown) => (console.log(
  typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
  , msg);

const events = (observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: any) =>
    observers.map((f: Function) => f(val))
});

const syncF = (timeline: timeline) =>
  (self: timeline) =>
    (f: Function) =>
      ((val: unknown) =>
        val === undefined
          ? undefined
          : ((nextVal: undefined | timeline) =>
            // RightIdentity: join = TTX => TX
            (nextVal === undefined
              ? undefined
              : (nextVal.type === timeline.type)
                ? nextVal.sync((val: unknown) =>
                  self.next = val)
                : (self.next = nextVal) /*&& (log(self.now))*/
            ))(f(val))//nextVal
      );

const T = (initFunction: Function =
  (timeline: timeline) => undefined): timeline => {
  const timeline = ((currentVal: any) => (ev: any) => ({
    type: "timeline-monad",  //for TTX => TX
    get now() { //getter returns a value of now
      return currentVal;
    },
    set next(nextVal: unknown) {
      ev.trigger(currentVal = nextVal);
    }, //log("next:" + nextVal);
    sync: (f: Function) =>
      T((self: timeline) =>
        ((ff: Function) =>
          third //<1> first, register the sync function
            (ev.register(ff))
            //<2> trigger self by the left operand on joint
            (ff(timeline.now))
            (self.now)//<3> returns init value on joint
        )(syncF(timeline)(self)(f))//ff
      ),
    "->": (f: Function) => timeline.sync(f)
  }))(undefined)(events([]));
  //just initialization and no trigger since there's no sync yet
  timeline.next = initFunction(timeline);
  return timeline;
};

export { T };