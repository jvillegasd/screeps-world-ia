const CreepBase = require('./base.creep');

const ROLE = 'harvester';

class RoleHarvester extends CreepBase {
  constructor() {
    super(ROLE);
  }

  run(creep) {
    if (creep.memory.busy || !this.creepHasRole(creep)) return false;

    if (creep.store.getFreeCapacity() > 0) {
      this.harvest(creep);
    } else {
      this.recharge(creep);
    }
  }

  recharge(creep) {
    // https://github.com/screeps/tutorial-scripts/blob/master/section5/role.harvester.js
  }
}


module.exports = RoleHarvester;
