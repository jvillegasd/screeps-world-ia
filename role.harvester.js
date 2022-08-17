const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'harvester';

class RoleHarvester extends CreepBase {
  constructor() {
    super(ROLE);
  }

  run(creep) {
    if (creep.memory.status === STATUSES.Harvest || !this.hasRole(creep))
      return false;

    if (creep.store.getFreeCapacity() > 0) {
      this.harvest(creep);
    } else {
      this.recharge(creep);
    }
  }

  recharge(creep) {
    if (creep.memory.status === STATUSES.Recharge) return;

    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) &&
          structure.structureType.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    if (targets.length > 0) {
      const code = creep.transfer(targets[0], RESOURCE_ENERGY);
      switch (code) {
        case ERR_NOT_IN_RANGE:
          this.moveTo(creep, targets[0], '#169612');
          break;
        case OK:
          creep.say('🔋 charge');
          this.setStatus(creep, STATUSES.Recharge);
          break;
        default:
          console.error(`⛔ code not handled: ${code}`);
      }
    }
  }
}

module.exports = new RoleHarvester();
