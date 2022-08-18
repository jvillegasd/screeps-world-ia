const ROLE_NAMES = ['role.harvester', 'role.builder', 'role.upgrader'];

const roles = ROLE_NAMES.map((role) => require(role));

module.exports = {
  runAll(creeps) {
    for (let creep of creeps) {
      this.runRoleTask(creep);
    }
  },
  runRoleTask(creep) {
    const creepRole = roles.filter((role) => role.hasRole(creep));
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
