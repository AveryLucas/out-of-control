const Flags = {
  actionPointSystem: {
    name: "actionPointSystem",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    // inCompatibleWith: [],
    required: [],
    events: {
      stateActions: {
        actionPointsExhausted: () => {},
      },
      onFlagApplied: (Board, node) => {
        node.setProp("data.core.actionPoints", {
          current: 2,
          maxPoints: 2,
          returnToState: null,
        });
      },
      onFlagRemoved: (Board, node) => {
        node.setProp("data.core.actionPoints", null);
      },
      // startOfTurn: (Board, node) => {},
      // endOfTurn: (Board, node) => {},
    },
  },
  isKillable: {
    name: "isUnit",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    required: ["actionPointSystem"],
    events: {
      onFlagApplied: (Board, node) => {
        node.setProp("data.core.health", 100);
      },
      onAttacked: (Board, node) => {
        console.log(node.data.core.health);
        if (node.data.core.health <= 0) {
          Board().deleteNode(node.id);
        }
      },
    },
  },
  isUnit: {
    name: "isUnit",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    required: ["isKillable", "actionPointSystem"],
    events: {
      onFlagApplied: (Board, node) => {
        node.setProp("data.core", { weapon: "bareHands", target: null }, true);
      },
    },
  },
  isSoilder: {
    name: "isSoilder",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    required: ["actionPointSystem", "isUnit"],
    events: {
      stateActions: {
        // Required Actions
        soilderRoaming: (Board, node) => {
          const allNodes = Board().getAllNodes();
          const enemySoildersByDistance = allNodes
            .filter(
              (enemy) => enemy.team != node.team && enemy.hasFlag("isSoilder")
            )
            .sort(
              (a, b) =>
                Board().pythagoreanTheorem(node.position, a.position) -
                Board().pythagoreanTheorem(node.position, b.position)
            );
          if (enemySoildersByDistance.length > 0) {
            const target = enemySoildersByDistance[0];
            node.setProp("data.core.target", target.id);
            node.setProp("state", "soilderHunting");
          }
        },
        soilderHunting: (Board, node) => {
          // If we have a target, and target exist.
          if (
            node.data.core.target !== undefined &&
            Board().getNode(node.data.core.target)
          ) {
            // const target = Board().getNode(node.data.core.target);
            // If within range, attack
            if (
              Board().getDistanceBetween(node.id, node.data.core.target) <=
              Weapons[node.data.core.weapon || "bareHands"].range
            ) {
              node.attack(
                node.data.core.target,
                Weapons[node.data.core.weapon].damage
              );
              // console.log(node.id, "HUNTING.IN_RANGE && ATTACKING");
            }
          } else {
            node.setProp("data.core.target", null);
            node.setProp("state", "soilderRoaming");
          }
        },
        soilderReturning: (Board, node) => {},
        default: (Board, node) => {
          node.setProp("state", "soilderRoaming");
        },
      },
    },
  },
};

const Weapons = {
  bareHands: {
    name: "Bare Hands",
    range: 0,
    damage: 30,
    hasProjectile: false,
    canReceiveFlags: false,
    flags: [],
  },
};

export default { Flags, Weapons };
