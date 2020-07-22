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
            ev.trigger(currentVal = nextVal);
        },
        sync: ((ev) => (f) => T((self) => ((ff) => third //<1> first, register the sync function
        (ev.register(ff))(ff(timeline.now))(self.now) //<3> returns init value on joint
        )((val) => (val === undefined)
            ? undefined
            : ((nextVal) => 
            // RightIdentity: join = TTX => TX
            ((nextVal === undefined)
                ? undefined
                : (nextVal.type === timeline.type)
                    ? nextVal.sync((val) => self.next = val)
                    : (self.next = nextVal) /*&& (log(self.now))*/))(f(val)) //nextVal
        )))(ev),
        "->": (f) => timeline.sync(f)
    }))(undefined)(events([]));
    //just initialization and no trigger since there's no sync yet
    timeline.next = initFunction(timeline);
    return timeline;
};
export { T };
