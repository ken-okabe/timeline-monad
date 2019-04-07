
const requireEsm = require('esm')(module);

const { T, world } = requireEsm("../code/dist/timeline-monad.js");

//instant fill
const timelineOf = (a) =>
  world.now = T(self => (self.now = a));

const matchTL = (TL1) => (TL2) =>
  TL1.now.type === undefined
    ? (expect(
      TL1.now
    ).toBe(
      TL2.now
    ))
    : (expect(
      TL1.now.now
    ).toBe(
      TL2.now.now
    ));

const str = TL1 => TL2 =>
  TL1.now.type === undefined
    ? "matching: " + TL1.now
    + " === " + TL2.now
    : "matching: " +
    "timelineOf(" + TL1.now.now + ")"
    + " === " +
    "timelineOf(" + TL2.now.now + ")";

const monadTest = (a) =>
  (f) => (g) => {

    describe("Left Identity", () => {

      const timeline1 =
        timelineOf(a)
          .sync(f);

      const timeline2 =
        f(a);

      test(str(timeline1)(timeline2), () =>
        matchTL(timeline1)(timeline2)
      )

    });

    describe("Right Identity", () => {

      const timeline1 =
        f(a);

      const timeline2 =
        f(a).sync(timelineOf)

      test(str(timeline1)(timeline2), () =>
        matchTL(timeline1)(timeline2)
      )

    });


    describe("Associativity", () => {

      const timeline1 =
        timelineOf(a)
          .sync(f)
          .sync(g);

      const timeline2 =
        timelineOf(a)
          .sync(b =>
            timelineOf(b)
              .sync(f)
              .sync(g));

      test(str(timeline1)(timeline2), () =>
        matchTL(timeline1)(timeline2)
      )

    });


  };

const compose =
  f => g =>
    a => g(f(a));

const f = (a) => (a * 2);
const g = (a) => (a + 1);

{
  const a = 1;
  const fTL = compose(f)(timelineOf);
  const gTL = compose(g)(timelineOf);

  monadTest(a)(fTL)(gTL);
}
{
  const a = timelineOf(5);

  const fTL = compose
    ((a) => (a.sync(f)))
    (timelineOf);

  const gTL = compose
    ((a) => (a.sync(g)))
    (timelineOf);

  monadTest(a)(fTL)(gTL);
}
