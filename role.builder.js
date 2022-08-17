const CreepBase = require('./creep.base');
const STATUSES = require('./creep.status');

const ROLE = 'builder';

class RoleBuilder extends CreepBase {
  constructor() {
    super(ROLE);
  }

  run(creep) {
    if (!this.hasRole(creep)) return false;

    if (
      creep.memory.status === STATUSES.Build &&
      creep.store[RESOURCE_ENERGY] === 0
    ) {
      this.harvest(creep);
    }
    if (
      creep.memory.status !== STATUSES.Build &&
      creep.store.getFreeCapacity() === 0
    ) {
      this.build(creep);
    }
  }

  build(creep) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      const code = creep.build(targets[0]);
      switch (code) {
        case ERR_NOT_IN_RANGE:
          this.moveTo(creep, targets[0], '#ffffff');
          break;
        case OK:
          creep.say('🚧 build');
          this.setStatus(creep, STATUSES.Build);
          break;
        default:
          console.error(
            `⛔ code not handled: ${code}`,
            `creep<name=<${creep.name}>, role=${this.roleName}>`
          );
      }
    }
  }
}

module.exports = new RoleBuilder();
