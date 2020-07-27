import React from "react";
const unitStates = {
  HUNTING: "hunting",
  FIGHTING: "fighting",
  RETURNING: "returning",
  RECOVERING: "recovering",
  IDLE: "idle",
};

function temporaryCreateUnit(team) {
  return {
    // state: unitStates.IDLE,
    id: Math.floor(Math.random() * 100),
    x: 0,
    y: 0,
    health: 30,
    team,
    target: null,
    actionPoints: 2,
    speed: 4,
    cooldown: 5,
    weapon: 0,
    returnAt: 0.5,
    fleeAt: 0.2,
    maxActionPoints: 2,
    maxCooldownTime: 2,
    maxResetTime: 10,
    // isHero: false,
    // heroID: null,
  };
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [temporaryCreateUnit(1), temporaryCreateUnit(2)],
      weapons: [
        { id: 0, range: 0, damage: 10, name: "fist", hasProjectile: false },
      ],
    };
  }

  componentDidMount() {
    // this.Unit().removeAllReferences(this.state.units[0].id);
    setInterval(() => {
      this.temporaryTick();
    }, 1000);
  }

  temporaryTick = () => {
    this.state.units.map((unit) => {
      switch (unit.state) {
        case unitStates.IDLE:
          // console.log(unit.id, "IDLE.START");
          if (unit.target == null) {
            let enemies = this.Unit().getEnemiesByDistance(unit.id);
            if (enemies.length != 0) {
              // console.log(enemies[0]);
              this.Unit().set(unit.id, "target", enemies[0].id);
              this.Unit().set(unit.id, "state", unitStates.HUNTING);
              // console.log(unit.id, "IDLE.SET_TARGET", enemies[0].id);
            }
          } else {
            this.Unit().set(unit.id, "state", unitStates.HUNTING);
          }
          break;
        case unitStates.HUNTING:
          // console.log(unit.id, "HUNTING.START");
          if (unit.target) {
            // console.log('er')
            // console.log(unit.id, "HUNTING.HAS_TARGET");
            const weapon = this.Weapon().get(unit.weapon);
            if (
              this.Unit().getDistanceBetween(unit.id, unit.target) <=
              weapon.range
            ) {
              // console.log(unit.id, "HUNTING.IN_RANGE && ATTACKING");
              this.Unit().attack(unit.id, unit.target);
            } else {
              // console.log(unit.id, "HUNTING.NOT_IN_RANGE");
            }
          } else {
            // console.log(unit.id, "HUNTING.NO_TARGET", unit.target);
          }
          break;
        case unitStates.FIGHTING:
          break;
        case unitStates.RETURNING:
          break;
        case unitStates.RECOVERING:
          const decideState = () => {
            if (unit.target) {
              this.Unit().set(unit.id, "state", unitStates.HUNTING);
            } else {
              this.Unit().set(unit.id, "state", unitStates.IDLE);
            }
          };
          if (unit.actionPoints < unit.maxActionPoints) {
            this.Unit().set(unit.id, "actionPoints", 1, true, () => {
              if (unit.actionPoints == unit.maxActionPoints) {
                decideState();
              }
            });
          } else {
            decideState();
          }
          break;
        default:
          // console.log(unit.id, "DEFAULT.START");
          this.Unit().set(unit.id, "state", unitStates.IDLE);
      }
      this.Unit().afterTurnLogic(unit.id);
    });
  };

  Engine = () => {
    return {
      Unit: this.Unit,
    };
  };

  Weapon = () => {
    return {
      get: (id) => {
        const index = this.state.weapons.findIndex((obj) => obj.id == id);
        return { ...this.state.weapons[index], index };
      },
    };
  };

  Unit = () => {
    return {
      get: (id) => {
        const index = this.state.units.findIndex((obj) => obj.id == id);
        return { ...this.state.units[index], index };
      },
      set: (id, prop, value, setRelative = false, callback) => {
        let units = this.state.units;
        const unit = this.Unit().get(id);
        if (setRelative) {
          if (typeof unit[prop] == "number" && !isNaN(Number(value))) {
            units[unit.index][prop] += Number(value);
          }
        } else {
          units[unit.index][prop] = value;
        }
        this.setState({ units }, callback);
        return unit;
      },
      setPos: (id, position = { x: 0, y: 0 }, setRelative = false) => {
        if (position.x !== undefined && !isNaN(Number(position.x))) {
          this.Unit().set(id, "x", position.x, setRelative);
        }
        if (position.y !== undefined && !isNaN(Number(position.y))) {
          this.Unit().set(id, "y", position.y, setRelative);
        }
      },
      getDistanceBetween: (id1, id2) => {
        const unit1 = this.Unit().get(id1);
        const unit2 = this.Unit().get(id2);
        // console.log(unit1, unit2) ;
        if (unit1.index == -1 || !unit2.index == -1) return -1;
        const a = unit1.x - unit2.x;
        const b = unit1.y - unit2.y;
        const c = Math.round(Math.sqrt(a * a + b * b));
        // console.log(c);
        return c;
      },
      moveTowardsPosition: (id, position = { x: 0, y: 0 }) => {
        let options = [];
        const unit = this.Unit().get(id);
        if (unit.x < position.x) options.push({ x: 1 });
        if (unit.x > position.x) options.push({ x: -1 });
        if (unit.y < position.y) options.push({ y: 1 });
        if (unit.y > position.y) options.push({ y: -1 });

        const dir = {
          x: 0,
          y: 0,
          ...options[Math.floor(Math.random() * options.length)],
        };

        this.Unit().setPos(id, dir, true);
      },
      getEnemiesByDistance: (id) => {
        const unit = this.Unit().get(id);
        let enemies = this.state.units
          .filter((obj) => obj.team != unit.team)
          .sort(
            (a, b) =>
              this.Unit().getDistanceBetween(id, a.id) -
              this.Unit().getDistanceBetween(id, b.id)
          );
        return enemies;
      },
      attack: (id, targetID) => {
        const unit = this.Unit().get(id);
        const weapon = this.Weapon().get(unit.weapon);
        this.Unit().set(targetID, "health", -weapon.damage, true);
        this.Unit().set(id, "actionPoints", -1, true);
        if (this.Unit().isDead(targetID)) {
          this.Unit().removeAllReferences(targetID);
        }
      },
      heal: (attackerID, targetID) => {},
      removeAllReferences: (id) => {
        let units = this.state.units;
        units = units
          .map((unit) => {
            if (unit.target == id) {
              return { ...unit, target: null };
            } else return unit;
          })
          .filter((unit) => unit.id != id);
        this.setState({ units });
      },
      isDead: (id) => {
        const unit = this.Unit().get(id);
        return unit ? unit.health <= 0 : true;
      },
      kill: (id) => {
        this.Unit().removeAllReferences(id);
      },
      afterTurnLogic: (id) => {
        const unit = this.Unit().get(id);
        if (unit.actionPoints <= 0) {
          this.Unit().set(unit.id, "state", unitStates.RECOVERING);
        }
        console.log(unit.id, unit.state, unit.actionPoints, unit.health);
      },
    };
  };

  render() {
    return (
      <div>
        {/* <Grid
          width="500"
          height="500"
          units={this.state.units}
          Engine={this.Engine}
        /> */}
      </div>
    );
  }
}

export default Game;
