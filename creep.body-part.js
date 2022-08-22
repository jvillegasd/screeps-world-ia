module.exports = {
  calculateCost(bodyParts) {
    return _.sum(bodyParts, (piece) => BODYPART_COST[piece]);
  },
};
