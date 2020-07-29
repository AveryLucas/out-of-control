import React from "react";
import NodeClass from "./NodeClass";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
    };
  }

  componentDidMount() {
    this.setState({
      nodes: [
        new NodeClass(this.Board, 1, ["isSoilder"], 1),
        new NodeClass(this.Board, 2, ["isSoilder"]),
      ],
    });
    // this.Board().addNewNode(1, ["isSoilder"]);
    // this.Board().addNewNode(2, ["isSoilder"]);
    // this.Board().addNewNode(2, ["isSoilder"]);

    // console.log(this.state.nodes);

    setInterval(() => {
      this.state.nodes.map((node) => {
        if (!node.initialized) {
          node.initialize();
        }
        // Verify node still exist before trying to perform logic with it
        if (this.Board().getNode(node.id)) node.tick();
      });
    }, 1000);
  }

  Board = () => {
    return {
      getAllNodes: () => {
        return this.state.nodes;
      },
      getNode: (id) => {
        const index = this.state.nodes.findIndex((node) => node.id == id);
        return this.state.nodes[index];
      },
      addNewNode: (team, flags = [], id) => {
        this.setState({
          // nodes: [...this.state.nodes, { id: Math.round(Math.random() * 100) }],
          nodes: [
            ...this.state.nodes,
            new NodeClass(this.Board, team, flags),
            id,
          ],
        });
      },
      applyNode: (id, newNode) => {
        let nodes = this.state.nodes;
        let index = nodes.findIndex((node) => node.id == newNode.id);
        if (index !== -1) {
          nodes[index] = newNode;
          this.setState({ nodes });
        }
      },
      getDistanceBetween: (id1, id2) => {
        const node1 = this.Board().getNode(id1);
        const node2 = this.Board().getNode(id2);
        if (node1.index !== -1 && node2.index !== -1) {
          return this.Board().pythagoreanTheorem(
            node1.position,
            node2.position
          );
        }
      },
      pythagoreanTheorem: (point1, point2) => {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;
        const c = Math.round(Math.sqrt(a * a + b * b));
        return c;
      },
      deleteNode: (id) => {
        this.setState({
          nodes: this.state.nodes.filter((node) => node.id != id),
        });
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
