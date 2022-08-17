const STATUSES = require('./creep.status');

class CreepBase {
  constructor(role) {
    this.roleName = role;
  }

  hasRole(creep) {
    return creep.memory.role === this.roleName;
  }

  setStatus(creep, status) {
    creep.memory.status = status;
  }

  suicide(creep) {
    creep.say('💀 suicide');
    this.setStatus(creep, 'Suicide');
    console.log(`${creep}${creep.pos} is suiciding`);
    creep.suicide();
  }

  moveTo(creep, target, color) {
    const opts = {};

    if (creep.memory.status === STATUSES.Move) return;
    if (color) {
      opts.visualizePathStyle = {
        stroke: color,
        opacity: 1,
        lineStyle: 'dotted',
      };
    }
    creep.say(`🚙 moving to ${target}`);
    this.setStatus(creep, STATUSES.Move);
    return creep.moveTo(target, opts);
  }

  harvest(creep) {
    if (creep.memory.status === STATUSES.Harvest) return;

    let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!closestSource) return;

    const code = creep.harvest(closestSource);
    switch (code) {
      case ERR_NOT_IN_RANGE:
        this.moveTo(closestSource, '#ffaa00');
        break;
      case OK:
        creep.say('🔄 harvest');
        this.setStatus(creep, STATUSES.Harvest);
      default:
        console.error(`⛔ Code not handled: ${code}`);
    }
  }
}

module.exports = CreepBase;
