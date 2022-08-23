const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'builder';
const BODY_PARTS = [WORK, WORK, CARRY, MOVE];
const MIN_AMOUNT = 2;

class RoleBuilder extends CreepBase {
  constructor() {
    super(ROLE, BODY_PARTS, MIN_AMOUNT);
  }

  run(creep) {
    if (!this.hasRole(creep)) return false;

    switch (creep.memory.status) {
      case STATUSES.Build:
        this.runBuildProcess(creep);
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

  runBuildProcess(creep) {
    if (creep.store[RESOURCE_ENERGY] > 0) {
      this.build(creep);
    } else {
      this.setStatus(creep, STATUSES.Harvest);
    }
  }

  runHarvestProcess(creep) {
    if (creep.store.getFreeCapacity() > 0) {
      this.harvest(creep);
    } else {
      this.build(creep);
    }
  }

  build(creep) {
    let sourcePath = this.getCurrentPath(creep);
    if (!sourcePath) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      sourcePath = (targets.length) ? targets[0]: undefined;
    }
    
    if (sourcePath) {
      const code = creep.build(sourcePath);
      switch (code) {
        case ERR_NOT_IN_RANGE:
          this.moveTo(creep, sourcePath, '#ffffff');
          break;
        case OK:
          creep.say('🚧 build');
          this.setStatus(creep, STATUSES.Build);
          this.removeCurrentPath(creep);
          break;
        default:
          console.log(this.getCreepName(creep), `⛔ code not handled: ${code}`);
      }
    }
  }
}

module.exports = new RoleBuilder();
