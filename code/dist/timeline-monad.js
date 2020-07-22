const third = (a) => (b) => (c) => c;
const log = (msg) => (console.log(typeof msg === "function"
    ? msg
    : JSON.stringify(msg))
    , msg);
const events = (observers) => ({
    register: (f) => (observers[observers.length] = f),
    trigger: (val) => observers.map((f) => f(val))
});
const syncF = (timeline) => (f) => (self) => ((val) => val === undefined
    ? undefined
    : ((nextVal) => 
    // RightIdentity: join = TTX => TX
    (nextVal === undefined
        ? undefined
        : (nextVal.type === timeline.type)
            ? nextVal.sync((val) => self.next = val)
            : (self.next = nextVal) /*&& (log(self.now))*/))(f(val)) //nextVal
);
const T = (initFunction = (timeline) => undefined) => {
    const timeline = ((currentVal) => (ev) => ({
        type: "timeline-monad",
        get now() {
            return currentVal;
        },
        set next(nextVal) {
            ev.trigger(currentVal = nextVal);
        },
        sync: (f) => T((self) => ((ff) => third //<1> first, register the sync function
        (ev.register(ff))(ff(timeline.now))(self.now) //<3> returns init value on joint
        )(syncF(timeline)(f)(self)) //ff
        ),
        "->": (f) => timeline.sync(f)
    }))(undefined)(events([]));
    //just initialization and no trigger since there's no sync yet
    timeline.next = initFunction(timeline);
    return timeline;
};
export { T };
