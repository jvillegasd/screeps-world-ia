const STATUSES = require('./creep.status');

class CreepBase {
  constructor(role) {
    this.roleName = role;
  }

  hasRole(creep) {
    return (
      creep.memory.role &&
      this.roleName.toString() === creep.memory.role.toString()
    );
  }

  getCreepName(creep) {
    return `creep<name=${creep.name}, role=${this.roleName}>`;
  }

  setStatus(creep, status) {
    creep.memory.status = status;
  }

  suicide(creep) {
    creep.say('💀 suicide');
    this.setStatus(creep, 'Suicide');
    creep.suicide();

    for (const resourceType in creep.carry) {
      creep.drop(resourceType);
    }
    delete Memory.creeps[creep.name];

    console.log(getCreepName(), `💀 commited suicide at ${creep.pos}`);
  }

  moveTo(creep, target, color) {
    const opts = {};

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
    let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!closestSource) return;

    const code = creep.harvest(closestSource);
    switch (code) {
      case ERR_NOT_IN_RANGE:
        this.moveTo(creep, closestSource, '#ffaa00');
        break;
      case OK:
        creep.say('🔄 harvest');
        this.setStatus(creep, STATUSES.Harvest);
        break;
      default:
        console.error(this.getCreepName(), `⛔ code not handled: ${code}`);
    }
  }
}

module.exports = CreepBase;
