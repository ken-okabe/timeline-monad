import { T } from "../code/dist/timeline-monad.js";
import { allThenResetTL } from "../code/dist/allThenResetTL.js";

const True = (done) => () => {
    done();
    return true;
};

test("timeline.next === 1", () => {
    //--------------------------
    const timeline = T();
    timeline.next = 1;
    expect(timeline.now)
        .toBe(1);
    //--------------------------
});

test("T(self => 1) === 1", () => {
    //--------------------------
    const timeline = T(self => 1);
    expect(timeline.now)
        .toBe(1);
    //--------------------------
});

test("T(self => 1)['->'](a => a * 2) === 2", () => {
    //--------------------------
    const timeline = T(self => 1)['->'](a => a * 2);
    expect(timeline.now)
        .toBe(2);
    //--------------------------
});

test("timeline['->']();", (done) => {
    //--------------------------
    const timeline = T();
    timeline['->']((a) => done.fail());
    //--------------------------
    // when timeline.now is undefined, never triggered
    setTimeout(done, 100);
});
test("timeline['->'](); timeline.next = undefined;", (done) => {
    //--------------------------
    const timeline = T();
    timeline['->']((a) => done.fail());
    timeline.next = undefined;
    //--------------------------
    // when timeline.now is undefined, never triggered
    setTimeout(done, 100);
});
test("timeline.next = 1;timeline['->']();", (done) => {
    //--------------------------
    const timeline = T();
    timeline.next = 1; //before sync;
    timeline['->']((a) => expect(a).toBe(1));
    //--------------------------
    //async test helper
    timeline['->'](True(done));
});
test("timeline['->']();timeline.next = 1;", (done) => {
    //--------------------------
    const timeline = T();
    timeline['->']((a) => expect(a).toBe(1));
    {
        timeline.next = 1; //after sync;
    }
    //--------------------------
    //async test helper
    timeline['->'](True(done));
});
test("timeline['->']();timeline.next = 1, !== 9;", (done) => {
    //--------------------------
    const timeline = T();
    timeline['->']((a) => expect(a).not.toBe(9));
    {
        timeline.next = 1; //after sync;
    }
    //--------------------------
    //async test helper
    timeline['->'](True(done));
});

test("timelineB = timelineA['->'](a => a * 2);", (done) => {
    //--------------------------
    const timelineA = T();
    const timelineB = timelineA['->']((a) => (a * 2));
    {
        timelineA.next = 1;
        expect(timelineB.now)
            .toBe(2); //1*2
    }
    //--------------------------
    //async test helper
    timelineB['->'](True(done));
});
test("timelineB = timelineA['->'](a => a *2 )" +
    "['->'](a=>a+1);", (done) => {
        //--------------------------
        const timelineA = T();
        const timelineB = timelineA
        ['->']((a) => (a * 2))
        ['->']((a) => (a + 1));
        {
            timelineA.next = 1;
            expect(timelineB.now)
                .toBe(3); //1*2+1
        }
        //--------------------------
        //async test helper
        timelineB['->'](True(done));
    });