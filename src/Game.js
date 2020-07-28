import React from "react";
import Constants from "./Constants";
// const unitStates = {
//   HUNTING: "hunting",
//   FIGHTING: "fighting",
//   RETURNING: "returning",
//   RECOVERING: "recovering",
//   IDLE: "idle",
// };

// function tempCreateNode(flags = []) {
//   return {
//     id: 1,
//     x: 0,
//     y: 0,
//     team: 1,
//     state: "default",
//     flags,
//     tracking: {},
//     data: {},
//   };
// }

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [tempCreateNode(["isUnit", "Fearless"])],
    };
  }

  componentDidMount() {
    this.state.nodes.map((node) => {
      this.NodeHelpers().tick(node.id);
    });
  }

  NodeHelpers = () => {
    return {
      getNode: (id) => {
        const index = this.state.nodes.findIndex((node) => node.id == id);
        return { ...this.state.nodes[index], index };
      },
      setProp: (id, path, value, setRelativeNum = false) => {
        let node = this.NodeHelper().getNode(id);
        const setToValue = (obj, path, value) => {
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

          if (
            setRelativeNum &&
            typeof obj[path[i]] == "number" &&
            !isNaN(Number(value))
          ) {
            obj[path[i]] += Number(value);
          } else {
            obj[path[i]] = value;
          }
        };
        setToValue(node, path, value);
      },
      tick: (id) => {
        node = this.NodeHelper().populate(node.id);
        const stateActions = node.flags.filter((flag) => {
          if (
            flag.events &&
            flag.events.stateActions &&
            flag.events.stateActions[node.state]
          ) {
            return true;
          }
        });
        for (var i = 0; i < stateActions.length; i++) {
          stateActions[i].events.stateActions[node.state]();
        }
      },
      populate: (id) => {
        let node = this.NodeHelper().getNode(id);
        node.flags = node.flags.map((id) => Constants.Flags[id]);
        return node;
      },
      getDistanceBetween: (id1, id2) => {
        const node1 = this.NodeHelper().getNode(id1);
        const node2 = this.NodeHelper().getNode(id2);
        if (node1.index !== -1 && node2.index !== -1) {
          return this.NodeHelper().pythagoreanTheorem(
            { x: node1.x, y: node1.y },
            { x: node2.x, y: node2.y }
          );
        }
      },
      pythagoreanTheorem: (point1, point2) => {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;
        const c = Math.round(Math.sqrt(a * a + b * b));
        return c;
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
