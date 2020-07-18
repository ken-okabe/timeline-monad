const right = (a) => (b) => b;
const third = (a) => (b) => (c) => c;
const log = (msg) => right(console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg)))(msg);
const events = (observers) => ({
    register: (f) => (observers[observers.length] = f),
    trigger: (val) => right(observers.map((f) => f(val)))(val)
});
const T = (initFunction = (timeline) => undefined) => {
    const timeline = ((currentVal) => (ev) => ({
        type: "timeline-monad",
        get now() {
            return currentVal;
        },
        set next(nextVal) {
            //log("next:" + nextVal);
            ((currentVal = nextVal) === undefined)
                ? undefined
                : ev.trigger(currentVal);
        },
        sync: ((ev) => (f) => T((self) => third //<1> first, register the sync function
        (ev.register((val) => ((nextVal) => 
        // RightIdentity: join = TTX => TX  
        ((nextVal !== undefined) &&
            (nextVal.type === timeline.type)
            ? nextVal.sync((val) => self.next = val)
            : (self.next = nextVal) /*&& (log(self.now))*/))(f(val)))) //nextVal
        (timeline.next = timeline.now)(self.now) //<3> returns init value on joint
        ))(ev),
        "->": (f) => timeline.sync(f)
    }))(undefined)(events([]));
    //just initialization and no trigger since there's no sync yet
    timeline.next = initFunction(timeline);
    return timeline;
};
export { T };
