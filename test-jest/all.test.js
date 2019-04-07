
const requireEsm = require('esm')(module);

const { T } = requireEsm("../code/dist/timeline-monad.js");
const { allThenResetTL } = requireEsm("../code/dist/allThenResetTL");
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
        timelineA.now = 1;
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
            expectedTL.now = [1, 5];
            timelineA.now = 9;
            timelineA.now = 1;
            timelineB.now = 5;
            //filled and cleared
        }
        {
            expectedTL.now = [9, 2];
            timelineA.now = 7;
            {
                timelineA.now = 9;
                timelineB.now = 2;
            } //filled and cleared
        }
        {
            expectedTL.now = [3, 9];
            timelineA.now = 1;
            {
                timelineA.now = undefined;
                {
                    timelineB.now = 9;
                    timelineA.now = 3;
                } //filled and cleared
            }
        }
        //-------------------------- 
        //async test helper
        timelineAB.sync(True(done));
    });
