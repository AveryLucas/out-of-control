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
  isRPGified: {
    name: "isUnit",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    required: [],
    events: {
      stateActions: {
        isAttacking: (Board, node) => {
          if (
            node.data.core.target !== undefined &&
            Board().getNode(node.data.core.target)
          ) {
            // If within range, attack
            const target = Board().getNode(node.data.core.target);
            const weapon = Weapons[node.data.core.weapon || "bareHands"];
            if (
              Board().getDistanceBetween(node.id, target.id) <= weapon.range
            ) {
              const {
                strength,
                dexterity,
                proficiency,
                agility,
                luck,
              } = node.data.core.rpg;

              const damage =
                (strength / 200) * (proficiency[weapon.type] || 1) +
                weapon.damage;

              const hitchance =
                (proficiency[weapon.type] || 1) +
                agility * 0.15 +
                luck * 0.1 +
                10;

              let didHit;
              for (var i = 0; i < (Math.floor(hitchance / 100) || 1); i++) {
                didHit = Math.random() * 100 < Math.min(hitchance, 90);
                if (didHit) {
                  node.attack(target.id, damage);
                  // Increase weapon type proficiency
                  node.triggerEvent("increaseProficiency", weapon.type);
                  // Statistics stuff here probably;
                } else {
                  // Statistics stuff here probably;
                }
              }
            }
          }
        },
      },
      increaseProficiency: (Board, node, args = []) => {
        const type = args[0];
        const proficiency = node.data.core.rpg.proficiency[type];

        if (!proficiency) {
          node.setProp(`data.core.rpg.proficiency.${type}`, {
            xp: 0,
            level: 0,
          });
        } else {
          proficiency[type].xp += 10;
          if (proficiency[type.xp >= 100]) {
            proficiency[type].level += 1;
            proficiency[type].xp = 0;
            // Statistics stuff here probably;
          }
          node.setProp(`data.core.rpg.proficiency.${type}`, proficiency[type]);
        }
      },
      onFlagApplied: (Board, node) => {
        node.setProp("data.core.rpg", {
          strength: 5,
          dexterity: 5,
          constitution: 5,
          agility: 5,
          luck: Math.round(Math.random() * 200),
          xp: 0,
          xpToNextLevel: 100,
          proficiency: {},
        });
      },
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
        if (node.data.core.health <= 0) {
          Board().deleteNode(node.id);
        }
      },
      onPropChanged: {
        path: "data.core.health",
        do: (current, previous) => {},
      },
    },
  },
  isUnit: {
    name: "isUnit",
    showFlag: true,
    overrideStats: null,
    modifiers: null,
    check: null,
    required: ["isKillable", "actionPointSystem", "isRPGified"],
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
            // If within range, attack
            node.setProp("state", "isAttacking");
            // const target = Board().getNode(node.data.core.target);
          }
          // else {
          //   node.setProp("data.core.target", null);
          //   node.setProp("state", "soilderRoaming");
          // }
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
    type: "fists",
    range: 0,
    damage: 10,
    hasProjectile: false,
    canReceiveFlags: false,
    flags: [],
  },
};

export default { Flags, Weapons };
