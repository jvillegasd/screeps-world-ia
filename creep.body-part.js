module.exports = {
  cost: {
    move: 50,
    work: 100,
    carry: 50,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10,
  },
  calculateCost(bodyParts) {
    return _.sum(bodyParts, (piece) => this.cost[piece]);
  },
};
