export default {
  Flags: {
    Coward: {
      name: "Coward",
      showFlag: true,
      overrideStats: { fleeAt: 0.8 },
      modifiers: { actionPoints: "*2" },
      check: (unit) => {
        // Check if unit meets requirements to have this flag.
        // if unit has fled 100% of battles and has participated in more then 5 battles
      },
      inCompatibleWith: [2],
      events: null,
    },
    Fearless: {
      name: "Fearless",
      showFlag: true,
      isState: false,
      overrideStats: { fleeAt: 0.2 },
      modifiers: { actionPoints: "*4" },
      check: (unit) => {
        // Check if unit meets requirements to have this flag.
        // if unit has not fled 100% of battles and has participated in more then 15 battles
      },
      inCompatibleWith: [1],
      events: null,
    },
    isUnit: {
      name: "isUnit",
      showFlag: true,
      overrideStats: null,
      modifiers: null,
      check: null,
      inCompatibleWith: [],
      events: {
        stateActions: {
          default: (game, unit, flag, flagList) => {
            console.log("DOOP");
          },
        },
      },
    },
    // FightingLogic: {
    //   name: "FightingLogic",
    //   showFlag: false,
    //   overrideStats: null,
    //   modifiers: null,
    //   check: null,
    //   inCompatibleWith: null,
    //   events: {
    //     stateActions: {
    //       fighting: (game, unit) => {
    //         // console.log("Do something!");
    //       },
    //     },
    //     // afterTurn: null,
    //     // beforeTurn: null,
    //     // onAttack: null,
    //   },
    // },
  },
};
