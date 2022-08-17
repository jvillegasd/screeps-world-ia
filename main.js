const roleHarvester = require('role.harvester');

// https://github.com/screeps/tutorial-scripts/blob/master/section5/main.js
module.exports.loop = () => {
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
  }
};
