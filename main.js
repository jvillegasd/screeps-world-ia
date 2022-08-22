const CreepManager = require('./creep.manager');
const Spawner = require('./struct.spawner');

module.exports.loop = () => {
  if (Game.cpu.tickLimit < 50) {
    console.warn('⚠️ game CPU dangerously low', Game.cpu);
  }
  
  // for (const roomName in Game.rooms) {
  //   const room = Game.rooms[roomName];
  //   const spawners = Spawner.getStructures(room);

  //   for (const spawnerName in spawners) {
  //     Spawner.run(spawners[spawnerName]);
  //   }
  // }

  CreepManager.runAll(Game.creeps);
};
