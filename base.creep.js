class CreepBase {
  constructor(role) {
    this.roleName = role;
  }

  creepHasRole(creep) {
    return creep.memory.role === this.roleName;
  }

  suicide(creep) {
    creep.say('💀 suicide');
    console.log(`${creep}${creep.pos} is suiciding`);
    creep.memory.busy = true;
    creep.suicide();
  }

  moveTo(creep, target, color) {
    const opts = {};

    if (creep.memory.busy) return;
    if (color) {
      opts.visualizePathStyle = {
        stroke: color,
        opacity: 1,
        lineStyle: 'dotted',
      };
    }

    return creep.moveTo(target, opts);
  }

  harvest(creep) {
    let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (closestSource && creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {
      this.moveTo(closestSource, '#ffaa00');
    }
  }
}

module.exports = CreepBase;
