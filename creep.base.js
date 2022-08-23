const STATUSES = require('./creep.status');
const creepBody = require('./creep.body-part');

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
    return `creep[name=${creep.name}, role=${this.roleName}]`;
  }

  setStatus(creep, status) {
    creep.memory.status = status;
  }

  canSpawn(spawner) {
    const numOfCreeps = _.sum(
      Game.creeps,
      (creep) => spawner.room.name === creep.room.name && this.hasRole(creep)
    );
    const hasEnoughEnergy =
      creepBody.calculateCost(this.bodyParts) <= spawner.room.energyAvailable;

    return numOfCreeps < this.minAmount && hasEnoughEnergy;
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
      case ERR_BUSY:
        // Ignore this case
        console.log(spawner.name, '🛠 spawner busy');
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        console.log(spawner.name, `🔋 not enough energy to spawn ${creepName}`);
      default:
        console.log(creepName, `⛔ code not handled: ${code}`);
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

    console.log(
      this.getCreepName(creep),
      `💀 commited suicide at ${creep.pos}`
    );
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
    creep.memory.currentPath = target;
    return creep.moveTo(target, opts);
  }

  getCurrentPath(creep) {
    return Game.getObjectById(creep.memory.currentPath);
  }

  removeCurrentPath(creep) {
    delete creep.memory.currentPath;
  }

  harvest(creep) {
    let sourcePath =
      this.getCurrentPath(creep) ||
      creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!sourcePath) return;

    const code = creep.harvest(sourcePath);
    switch (code) {
      case ERR_NOT_IN_RANGE:
        this.moveTo(creep, sourcePath, '#ffaa00');
        break;
      case OK:
        creep.say('🔄 harvest');
        this.setStatus(creep, STATUSES.Harvest);
        this.removeCurrentPath(creep);
        break;
      default:
        console.log(this.getCreepName(creep), `⛔ code not handled: ${code}`);
    }
  }
}

module.exports = CreepBase;
