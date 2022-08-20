const STATUSES = require('./creep.status');

class CreepBase {
  constructor(role, bodyParts, minAmount) {
    this.roleName = role;
    this.bodyParts = bodyParts;
    this.minAmount = minAmount;
  }

  hasRole(creep) {
    return creep.memory.role && this.roleName === creep.memory.role;
  }

  getCreepName(creep) {
    return `creep<name=${creep.name}, role=${this.roleName}>`;
  }

  setStatus(creep, status) {
    creep.memory.status = status;
  }

  canSpawn(spawner) {
    const numOfCreeps = _.sum(
      Game.creeps,
      (creep) => spawner.room.name === creep.room.name && this.hasRole(creep)
    );
    return numOfCreeps <= this.minAmount;
  }

  spawn(spawner) {
    const creepName = `${this.roleName}_${Game.time}`;
    const code = spawner.spawnCreep(this.bodyParts, creepName, {
      memory: { role: this.roleName, status: STATUSES.Idle },
    });

    switch (code) {
      case OK:
        console.log(`🛠 ${creepName} spawned`);
        break;
      default:
        console.error(creepName, `⛔ code not handled: ${code}`);
    }
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
    creep.say(`🚙 move`);
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
