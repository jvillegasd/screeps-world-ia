const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'harvester';
const BODY_PARTS = [WORK, WORK, CARRY, MOVE];
const MIN_AMOUNT = 2;

class RoleHarvester extends CreepBase {
  constructor() {
    super(ROLE, BODY_PARTS, MIN_AMOUNT);
  }

  run(creep) {
    if (!this.hasRole(creep)) return false;

    switch (creep.memory.status) {
      case STATUSES.Recharge:
        this.runRechargeProcess(creep);
        break;
      case STATUSES.Idle:
      case STATUSES.Harvest:
        this.runHarvestProcess(creep);
        break;
      default:
        console.log(
          this.getCreepName(creep),
          `⛔ status not handled: ${creep.memory.status}`
        );
    }
  }

  runRechargeProcess(creep) {
    if (creep.store[RESOURCE_ENERGY] > 0) {
      this.recharge(creep);
    } else {
      this.setStatus(creep, STATUSES.Harvest);
    }
  }

  runHarvestProcess(creep) {
    if (creep.store.getFreeCapacity() > 0) {
      this.harvest(creep);
    } else {
      this.recharge(creep);
    }
  }

  recharge(creep) {
    let sourcePath = this.getCurrentPath(creep);
    if (!sourcePath) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      sourcePath = (targets.length) ? targets[0] : undefined;
    }
    

    if (sourcePath) {
      const code = creep.transfer(sourcePath, RESOURCE_ENERGY);
      switch (code) {
        case ERR_NOT_IN_RANGE:
          this.moveTo(creep, sourcePath, '#169612');
          break;
        case OK:
          creep.say('🔋 charge');
          this.setStatus(creep, STATUSES.Recharge);
          this.removeCurrentPath(creep);
          break;
        default:
          console.log(this.getCreepName(creep), `⛔ code not handled: ${code}`);
      }
    }
  }
}

module.exports = new RoleHarvester();
