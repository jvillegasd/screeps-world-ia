const CreepManager = require('./creep.manager');
const Spawner = require('./struct.spawner');

const TICK_LIMIT = 50;

module.exports.loop = () => {
  if (Game.cpu.tickLimit < TICK_LIMIT) {
    console.warn('⚠️ game CPU dangerously low', Game.cpu);
    return;
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (!room.controller || !room.controller.my) {
      continue;
    }

    // TODO: Create spawner manager
    const spawnTicks = 5;
    if (Game.time % spawnTicks === 0) {
      const spawners = Spawner.getStructures(room);
      for (const spawnerName in spawners) {
        Spawner.run(spawners[spawnerName]);
      }
    }
  }

  CreepManager.runAll(Game.creeps);
};
