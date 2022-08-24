const roles = {
  harvester: require('./role.harvester'),
  upgrader: require('./role.upgrader'),
  builder: require('./role.builder'),
};

module.exports = {
  runAll(creeps) {
    for (let name in creeps) {
      this.runRoleTask(creeps[name]);
    }
  },
  runRoleTask(creep) {
    const creepRole = roles[creep.memory.role];
    if (creep.spawning || !creepRole || !this.preRun(creep, creepRole)) {
      return;
    }

    creepRole.run(creep);
  },
  preRun(creep, creepRole) {
    if (creep.ticksToLive === 1) {
      // TODO: Inform a Spawner to replace the creep
      creepRole.suicide(creep);
      return false;
    }
    return true;
  },
};
