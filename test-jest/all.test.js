import { T } from "../code/dist/timeline-monad.js";
import { allThenResetTL } from "../code/dist/allThenResetTL.js";
const True = (done) => () => {
    done();
    return true;
};
test("timelineAB = allThenResetTL" +
    "([timelineA, timelineB])", (done) => {
        //--------------------------
        const timelineA = T();
        const timelineB = timelineA
            .sync((a) => a * 2);
        const timelineAB = allThenResetTL(
            [timelineA, timelineB]);
        timelineAB
            .sync((arr) => expect(arr).toEqual([1, 2]));
        timelineA.next = 1;
        //-------------------------- 
        //async test helper
        timelineAB.sync(True(done));
    });
test("timelineAB = allThenResetTL" +
    "([timelineA, timelineB]) multi", (done) => {
        //--------------------------
        const timelineA = T();
        const timelineB = T();
        const timelineAB = allThenResetTL([timelineA, timelineB]);
        timelineAB
            .sync((arr) => expect(arr).toEqual(expectedTL.now));

        const expectedTL = T();

        {
            expectedTL.next = [1, 5];
            timelineA.next = 9;
            timelineA.next = 1;
            timelineB.next = 5;
            //filled and cleared
        }
        {
            expectedTL.next = [9, 2];
            timelineA.next = 7;
            {
                timelineA.next = 9;
                timelineB.next = 2;
            } //filled and cleared
        }
        {
            expectedTL.next = [3, 9];
            timelineA.next = 1;
            {
                timelineA.next = undefined;
                {
                    timelineB.next = 9;
                    timelineA.next = 3;
                } //filled and cleared
            }
        }
        //-------------------------- 
        //async test helper
        timelineAB.sync(True(done));
    });
