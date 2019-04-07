interface timeline {
  type: string;
  timeFunction: Function;
  now: any;
  sync: Function;
}
//the timeline property `now` means
//time-index of the current time
// on the timeline from now until the future / next - now

const right = (a: any) => (b: any) => b;

const Events = () => ((observers: Function[]) => ({
  register: (f: Function) =>
    (observers[observers.length] = f),
  trigger: (val: any) => right
    (observers.map((f: Function) => f(val)))
    (val)
}))([]);

const world = {
  set now(timeline: timeline) {
    timeline.timeFunction(timeline);
  }
};

const T = ((Events) =>
  (timeFunction: Function = () => { }): timeline =>
    ((currentVal: any) => {
      //immutable in the frozen universe
      const timeline = ((ev) => ({
        type: "timeline-monad",  //for TTX => TX
        timeFunction: timeFunction,
        get now() { //getter returns a value of now
          return currentVal;
        },
        set now(val) {
          currentVal = val;
          (currentVal === undefined)
            ? undefined
            : ev.trigger(currentVal);
        },
        sync: ((ev) => (f: Function) =>
          world.now = T((self: timeline) =>
            right
              (ev.register((val: unknown) =>
                ((newVal: undefined | timeline) =>
                  // RightIdentity: join = TTX => TX  
                  ((newVal !== undefined) &&
                    (newVal.type === timeline.type)
                    ? newVal.sync((val: unknown) =>
                      self.now = val)
                    : self.now = newVal
                  ))(f(val))))
              (timeline.now = timeline.now)
          ))(ev)
      }))(Events());

      return timeline;
    })(undefined))(Events);

export { T, world };