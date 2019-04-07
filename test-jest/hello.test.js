
const requireEsm = require('esm')(module);
const { T } = requireEsm("../code/dist/timeline-monad.js");
const True = (done) => () => {
    done();
    return true;
};
test("timeline.now === undefined ", () => {
    //--------------------------
    const timeline = T();
    expect(timeline.now)
        .toBeUndefined();
    //--------------------------
});
test("timeline.now === 1", () => {
    //--------------------------
    const timeline = T();
    timeline.now = 1;
    expect(timeline.now)
        .toBe(1);
    //--------------------------
});
test("timeline.sync();", (done) => {
    //--------------------------
    const timeline = T();
    timeline.sync((a) => done.fail());
    //-------------------------- 
    // when timeline.now is undefined, never triggered
    setTimeout(done, 100);
});
test("timeline.sync(); timeline.now = undefined;", (done) => {
    //--------------------------
    const timeline = T();
    timeline.sync((a) => done.fail());
    timeline.now = undefined;
    //-------------------------- 
    // when timeline.now is undefined, never triggered
    setTimeout(done, 100);
});
test("timeline.now = 1;timeline.sync();", (done) => {
    //--------------------------
    const timeline = T();
    timeline.now = 1; //before sync;  
    timeline.sync((a) => expect(a).toBe(1));
    //--------------------------
    //async test helper
    timeline.sync(True(done));
});
test("timeline.sync();timeline.now = 1;", (done) => {
    //--------------------------
    const timeline = T();
    timeline.sync((a) => expect(a).toBe(1));
    {
        timeline.now = 1; //after sync;  
    }
    //--------------------------
    //async test helper
    timeline.sync(True(done));
});
test("timeline.sync();timeline.now = 1, !== 9;", (done) => {
    //--------------------------
    const timeline = T();
    timeline.sync((a) => expect(a).not.toBe(9));
    {
        timeline.now = 1; //after sync;  
    }
    //--------------------------
    //async test helper
    timeline.sync(True(done));
});
test("timelineB = timelineA.sync(a=> a*2);", (done) => {
    //--------------------------
    const timelineA = T();
    const timelineB = timelineA.sync((a) => (a * 2));
    {
        timelineA.now = 1;
        expect(timelineB.now)
            .toBe(2); //1*2
    }
    //--------------------------
    //async test helper
    timelineB.sync(True(done));
});
test("timelineB = timelineA.sync(a=>a*2)" +
    ".sync(a=>a+1);", (done) => {
        //--------------------------
        const timelineA = T();
        const timelineB = timelineA
            .sync((a) => (a * 2))
            .sync((a) => (a + 1));
        {
            timelineA.now = 1;
            expect(timelineB.now)
                .toBe(3); //1*2+1
        }
        //--------------------------
        //async test helper
        timelineB.sync(True(done));
    });
