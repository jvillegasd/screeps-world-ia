const CreepManager = require('./creep.manager');

module.exports.loop = () => {
  if (Game.cpu.tickLimit < 50) {
    console.warn('⚠️ game CPU dangerously low', Game.cpu);
  }
  // TODO: Create Struct base class and Spawner
  CreepManager.runAll(Game.creeps);
};
