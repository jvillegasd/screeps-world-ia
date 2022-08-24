const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'upgrader';
const BODY_PARTS = [WORK, WORK, CARRY, MOVE];
const MIN_AMOUNT = 4;

class RoleUpgrader extends CreepBase {
  constructor() {
    super(ROLE, BODY_PARTS, MIN_AMOUNT);
  }

  run(creep) {
    if (!this.hasRole(creep)) return false;

    switch (creep.memory.status) {
      case STATUSES.Upgrade:
        this.runUpgradeProcess(creep);
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

  runUpgradeProcess(creep) {
    if (creep.store[RESOURCE_ENERGY] > 0) {
      this.upgrade(creep);
    } else {
      this.setStatus(creep, STATUSES.Harvest);
    }
  }

  runHarvestProcess(creep) {
    if (creep.store.getFreeCapacity() > 0) {
      this.harvest(creep);
    } else {
      this.upgrade(creep);
    }
  }

  upgrade(creep) {
    const code = creep.upgradeController(creep.room.controller);
    switch (code) {
      case ERR_NOT_IN_RANGE:
        this.moveTo(creep, creep.room.controller, '#169612');
        break;
      case OK:
        creep.say('⚡ upgrade');
        this.setStatus(creep, STATUSES.Upgrade);
        this.removeCurrentTarget(creep);
        break;
      default:
        console.log(this.getCreepName(creep), `⛔ code not handled: ${code}`);
    }
  }
}

module.exports = new RoleUpgrader();
