import Constants from "./Constants";

class Node {
  constructor(Board, team = 0, flags = [], id) {
    this.prev = null;
    this.Board = Board;
    this.id = id || Math.round(Math.random() * 1000);
    this.position = { x: 0, y: 0 };
    this.team = team;
    this.initialized = false;
    this.state = "default";
    this.flags = [];
    this.tracking = {};
    this.data = { flags };
  }

  initialize = () => {
    for (var i = 0; i < this.data.flags.length; i++) {
      this.addFlag(this.data.flags[i]);
    }
    this.initialized = true;
    // console.log("Init");
  };

  triggerEvent = (event, ...args) => {
    const populatedFlags = this.getPopulatedFlags();
    const stateActions = populatedFlags.filter((flag) => {
      if (flag.events && flag.events[event]) {
        return true;
      }
    });
    for (var i = 0; i < stateActions.length; i++) {
      stateActions[i].events[event](this.Board, this, args);
    }
    this.Board().applyNode(this.id, this);
  };

  triggerStateActions = () => {
    const populatedFlags = this.getPopulatedFlags();
    const stateActions = populatedFlags.filter((flag) => {
      if (
        flag.events &&
        flag.events.stateActions &&
        flag.events.stateActions[this.state]
      ) {
        return true;
      }
    });
    for (var i = 0; i < stateActions.length; i++) {
      stateActions[i].events.stateActions[this.state](this.Board, this);
    }
  };

  triggerOnChangeEvents = (path, current, previous) => {
    const populatedFlags = this.getPopulatedFlags();
    const onPropChangeFlags = populatedFlags.filter((flag) => {
      if (
        flag.events &&
        flag.events.onPropChanged &&
        flag.events.onPropChanged.path == path
      ) {
        return true;
      }
    });
    for (var i = 0; i < onPropChangeFlags.length; i++) {
      onPropChangeFlags[i].events.onPropChanged.do(current, previous);
    }
  };

  tick = () => {
    this.triggerStateActions();
    this.Board().applyNode(this.id, this);
  };

  getPopulatedFlags = () => {
    let temp = this;
    return temp.flags.map((id, index) => {
      return Constants.Flags[id];
    });
  };

  addFlag = (flagID) => {
    if (Constants.Flags[flagID]) {
      const flag = Constants.Flags[flagID];

      this.flags.push(flagID);
      this.addRequiredFlags(flag);

      if (flag.events && flag.events.onFlagApplied) {
        flag.events.onFlagApplied(this.Board, this);
      }
    }
  };

  hasFlag = (flag) => {
    return this.flags.indexOf(flag) != -1;
  };

  removeFlag = (flag) => {
    this.flags.filter((flag) => flag.name !== flag);
  };

  setProp = (path, value, setRelative = false) => {
    let obj = this;
    const previous = this.deepGetValue(this, path);
    obj = this.deepSetValue(obj, path, value, setRelative);
    const current = this.deepGetValue(this, path);

    // console.log({ current, previous });

    this.triggerOnChangeEvents(path, current, previous);
    this.Board().applyNode(this.id, obj);
  };

  // setPosition = (position = { x: 0, y: 0 }) => {};

  moveTowards = (position = { x: 0, y: 0 }) => {
    let options = [];
    if (this.position.x < position.x) options.push({ x: 1 });
    if (this.position.x > position.x) options.push({ x: -1 });
    if (this.position.y < position.y) options.push({ y: 1 });
    if (this.position.y > position.y) options.push({ y: -1 });

    const dir = {
      x: 0,
      y: 0,
      ...options[Math.floor(Math.random() * options.length)],
    };

    this.setProp("position", {
      x: this.position.x + dir.x,
      y: this.position.y + dir.y,
    });
  };

  attack = (id, amount = 1) => {
    const target = this.Board().getNode(id);
    target.setProp("data.core.health", -amount, true);
    target.triggerEvent("onAttacked");
  };

  addRequiredFlags = (flag) => {
    for (var i = 0; i < flag.required.length; i++) {
      if (!this.hasFlag(flag)) {
        this.addFlag(flag.required[i]);
      }
    }
  };

  deepGetValue = (obj, path) => {
    var i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) {
      if (obj[path[i]]) {
        obj = obj[path[i]];
      } else {
        obj[path[i]] = {};
        obj = obj[path[i]];
      }
    }
    return obj[path[i]];
  };
  // Helpers
  deepSetValue = (obj, path, value, setRelative) => {
    var i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) {
      if (obj[path[i]]) {
        obj = obj[path[i]];
      } else {
        obj[path[i]] = {};
        obj = obj[path[i]];
      }
    }

    if (setRelative) {
      if (typeof obj[path[i]] == "number" && !isNaN(Number(value))) {
        obj[path[i]] += Number(value);
      } else if (typeof obj[path[i]] == "object" && typeof value == "object") {
        obj[path[i]] = Object.assign(obj[path[i]], value);
      }
    } else {
      obj[path[i]] = value;
    }
    return obj;
  };
}

export default Node;
