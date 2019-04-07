const requireEsm = require('esm')(module);
const { T } = requireEsm("../code/dist/timeline-monad.js");
const True = (done) => () => {
    done();
    return true;
};
//  multiple values on the timeline
{
    const timeline = T();
    test("timeline.now = 1 -> 2 -> 3;", (done) => {
        //--------------------------
        timeline.sync((a) => expect(a)
            .toBe(timeline.now) //1 -> 2 -> 3
        );
        //-------------------------- 
        //async test helper
        timeline.sync(True(done));
    });
    timeline.now = 1; //trigger
    timeline.now = 2; //trigger
    timeline.now = 3; //trigger
}
{
    const timeline = T();
    timeline.now = 1;
    timeline.now = 2;
    timeline.now = 3; //trigger
    test("timeline.now = 3;", (done) => {
        //--------------------------
        timeline.sync((a) => expect(a)
            .toBe(3));
        //--------------------------
        //async test helper
        timeline.sync(True(done));
    });
}
