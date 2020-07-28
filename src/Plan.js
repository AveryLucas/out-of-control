// The plan.
// Units sorted by speed and mapped for actions.
// - Each team starts with 4 units.
// - Units have a chance of being created every X moves.
// - Units move towards closest enemy and attacks them.
// - Units low on health will attempt to go back to their base to heal.
// - Units who have survived a certain amount of encounters will become heros only after returning to base.
// - Heroes can level up and receive upgrades and items that help them in battle.
// - Everytime a unit wins a fight, the player recieves a gold coin.
// - | Heroes earn double the coin and can earn even more with upgrades
// - At a certain interval of moves, the player has to pay X ammount of upkeep for every unit owned.
// - If the player cannot pay they go into debt. If the player is in debt for too long the player looses.

// Engine Functions Needed
// - Unit.MoveTowardsPosition (id, position={x:0, y:0});
// - Unit. (id, position={x:0, y:0});
// - Unit.Attack (attackerID, targetID);
// - Unit.Heal (id, amount);
// - Unit.SetState (id, amount);
// - Board.SpawnProjectile(position={x:0, y:0}, target={x:0, y:0}, type);
// - Board.SpawnUnit(position={x: 0, y:0}, type);

// Techincal Unit Game Design Stuff
// - Units need action points to do anything.
// - Whenever a unit moves or attacks, it cost them 1 action point.
// - When a unit runs out of action points, they become exhausted, and have to wait a set amount of turns before their action points are recovered.

// Mock Data Layout
const unitStates = {
  HUNTING: "hunting",
  FIGHTING: "fighting",
  RETURNING: "returning",
  IDLE: "idle",
  // RECOVERING: "recovering",
  // FLEEING: "fleeing", Out of Scope
};

const unitTitles = [];
const buildingTitles = [];

const mockData = {
  units: [
    {
      state: unitStates.IDLE,
      x: 0,
      y: 0,
      health: 100,
      target: null,
      actionPoints: 2,
      speed: 4,
      cooldown: 5,
      maxActionPoints: 2,
      maxCooldownTime: 2,
      maxResetTime: 10,
      // isHero: false,
      // heroID: null,
    },
  ],
  // buildings: [
  //   {
  //     x: 2,
  //     y: 2,
  //     team: "red",
  //     health,
  //     canSpawnUnits: true,
  //     spawnUnitCountdown: 5,
  //   },
  // ],
};

// Title System
// - All units/buildings start off with the same stats. Titles are given to disguish units between each other.
// - Titles can be leveled up for increasingly better advantages
// | Example..

const unit = {
  // Position
  x: 0,
  y: 0,
  // Behavior Logic
  state: unitStates.IDLE,
  target: null,
  // Current Stats / Info
  health: 100,
  actionPoints: 2,
  cooldown: 5,
  speed: 4,
  // Cooldown Periods
  maxActionPoints: 2,
  maxCooldownTime: 2,
  maxResetTime: 10,
};

// const weapons = [{ id: 0, range: 0, damage: 10, name: "fist", hasProjectile: false }]

// Tracked Stats
// - Kills with weapon type
// - Kills against team
// - Kills with current title
// - Kills with current weapon
// - Times fleed from combat
// - Times bitten by wearwolf/vampire...
// - Times knocked unconscious
// - Times sparred enemy death

const mockTrackedStats = {
  kills: { byType: { Sword: 10, Bow: 0 } },
};

// set something.another.else
//

// const damageLater = weaponProficiency * weaponDamage / defenderArmorReduction;
// const hitChanceLater = undefined;
const damageNow = weaponDamage;
const hitChanceNow = 50;

const unitTitles = [
  {
    name: "Swordsmen",
    showTitle: false,
    // requirements: null, // Requirements of null are titles that cannot be gained. (Typically starter titles)
    // weaponAward: null, // Given once unit returns to a applicable building
    leveled: [
      {
        requirements: { tracked: "kills.byType.Sword", condition: ">=5" },
        series: "Untrained",
        name: "Swordsmen",
        showTitle: false,
        // mods: { proficiency: },
      },
    ],
  },
  {
    name: "Archer",
    requirements: null,
    weaponAward: 2,
  },
];

// UNITS
// BUILDINGS
// WEAPONS
// ALL LINKED

// Unit flags..

// @ location
// - In_Building_InDestructible
// - In_Building_Destructible
// - In_Building_Friendly
// - In_Building_Hostile

// @ current state
// - Attacking_Unit
// - Recovering
// - Hunting
// - Fleeing

// @ behavior traits
// - Coward
// - Fearless
// - Building_Destroyer

// Some flags cancel each other..
// | For example.. a unit cant have both In_Building_Destructible and In_Building_InDestructible
// | Or.. Coward and Fearless

// Some flags come with stat improvements
// Example.. Untrained_Archer comes with a status bonus of -1 to archery profeciency
// Some flags can be leveled.

const mockFlagData = {
  Coward: {
    name: "Coward",
    showFlag: true,
    overrideStats: { fleeAt: 0.8 },
    modifiers: { actionPoints: "*2" },
    check: (unit) => {
      // Check if unit meets requirements to have this flag.
      // if unit has fled 100% of battles and has participated in more then 5 battles
    },
    inCompatibleWith: [],
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
    inCompatibleWith: [],
  },
  FightingLogic: {
    name: "FightingLogic",
    showFlag: false,
    overrideStats: null,
    modifiers: null,
    check: null,
    inCompatibleWith: null,
    stateActions: {
      fighting: (game, unit) => {
        console.log("Do something!");
      },
    },
  },
};

const unitStates = {
  HUNTING: "hunting",
  FIGHTING: "fighting",
  RETURNING: "returning",
  IDLE: "idle",
  // RECOVERING: "recovering",
  // FLEEING: "fleeing", Out of Scope
};
