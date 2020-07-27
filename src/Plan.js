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

// const building

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
