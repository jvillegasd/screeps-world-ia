const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');

class Spawner {
  constructor() {
    this.minimumCreepCost = 300;
    this.structureType = STRUCTURE_SPAWN;
    this.structureFilter = { structureType: this.structureType };
  }

  run(spawner) {
    // Spawner is already spawning
    if (spawner.spawning != null) {
      return;
    }

    // Spawner can not create a basic creep
    if (spawner.store[RESOURCE_ENERGY] < this.minimumCreepCost) {
      return;
    }

    // Set a hierarchy of roles
    if (roleHarvester.canSpawn(spawner)) {
      roleHarvester.spawn(spawner);
    } else if (roleUpgrader.canSpawn(spawner)) {
      roleUpgrader.spawn(spawner);
    }
  }

  getStructures(room) {
    return room.find(FIND_MY_STRUCTURES, {
      filter: this.structureFilter,
    });
  }

  getConstructionSites(room) {
    return room.find(FIND_CONSTRUCTION_SITES, {
      filter: this.structureFilter,
    });
  }
}

module.exports = new Spawner();
