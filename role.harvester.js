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
    let source = this.getCurrentTarget(creep);
    if (!source) {
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
      source = (targets.length) ? targets[0] : undefined;
    }
    

    if (source) {
      const code = creep.transfer(source, RESOURCE_ENERGY);
      switch (code) {
        case ERR_NOT_IN_RANGE:
          this.moveTo(creep, source, '#169612');
          break;
        case OK:
          creep.say('🔋 charge');
          this.setStatus(creep, STATUSES.Recharge);
          this.removeCurrentTarget(creep);
          break;
        default:
          console.log(this.getCreepName(creep), `⛔ code not handled: ${code}`);
      }
    }
  }
}

module.exports = new RoleHarvester();
