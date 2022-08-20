const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'upgrader';
const BODY_PARTS = [WORK, WORK, CARRY, MOVE];
const MIN_AMOUNT = 2;

class RoleUpgrader extends CreepBase {
  constructor() {
    super(ROLE, BODY_PARTS, MIN_AMOUNT);
  }

  run(creep) {
    if (!this.hasRole(creep)) return false;

    if (
      creep.memory.status === STATUSES.Upgrade &&
      creep.store[RESOURCE_ENERGY] === 0
    ) {
      this.harvest(creep);
    }
    if (
      creep.memory.status !== STATUSES.Upgrade &&
      creep.store.getFreeCapacity() === 0
    ) {
      this.upgrade(creep);
    }
  }

  upgrade(creep) {
    const code = creep.upgradeController(creep.room.controller);
    switch (code) {
      case ERR_NOT_IN_RANGE:
        this.moveTo(code, creep.room.controller, '#D1D100');
        break;
      case OK:
        creep.say('⚡ upgrade');
        this.setStatus(creep, STATUSES.Upgrade);
        break;
      default:
        console.error(this.getCreepName(), `⛔ code not handled: ${code}`);
    }
  }
}

module.exports = new RoleUpgrader();
