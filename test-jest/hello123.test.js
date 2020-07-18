import { T } from "../code/dist/timeline-monad.js";
import { allThenResetTL } from "../code/dist/allThenResetTL.js";
const True = (done) => () => {
    done();
    return true;
};
//  multiple values on the timeline
{
    const timeline = T();
    test("timeline.next = 1 -> 2 -> 3;", (done) => {
        //--------------------------
        timeline['->']((a) => expect(a)
            .toBe(timeline.now) //1 -> 2 -> 3
        );
        //-------------------------- 
        //async test helper
        timeline['->'](True(done));
    });
    timeline.next = 1; //trigger
    timeline.next = 2; //trigger
    timeline.next = 3; //trigger
}
{
    const timeline = T();
    timeline.next = 1;
    timeline.next = 2;
    timeline.next = 3; //trigger
    test("timeline.next = 3;", (done) => {
        //--------------------------
        timeline['->']((a) => expect(a)
            .toBe(3));
        //--------------------------
        //async test helper
        timeline['->'](True(done));
    });
}
