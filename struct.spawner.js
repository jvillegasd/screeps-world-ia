const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');

class Spawner {
  constructor() {
    this.structureType = STRUCTURE_SPAWN;
    this.structureFilter = { structureType: this.structureType };
    this.sites = {};
    this.structures = {};
  }

  run(spawner) {
    if (spawner.spawning) {
        console.log(spawner.name, '🛠 spawn');
        return;
    }
    
    // Set a hierarchy of roles
    if (roleHarvester.canSpawn(spawner)) {
      roleHarvester.spawn(spawner);
    } else if (roleUpgrader.canSpawn(spawner)) {
      roleUpgrader.spawn(spawner);
    } else {
      console.log('cannot')
    }
  }

  getStructures(room) {
    if (!this.structures[room.name]) {
      this.structures[room.name] = room.find(FIND_MY_SPAWNS, {
        filter: this.structureFilter,
      });
    }
    return this.structures[room.name];
  }

  getConstructionSites(room) {
    if (!this.sites[room.name]) {
      this.sites[room.name] = room.find(FIND_CONSTRUCTION_SITES, {
        filter: this.structureFilter,
      });
    }
    return this.sites[room.name];
  }

  gc() {
    this.sites = {};
    this.structures = {};
  }
}

module.exports = new Spawner();
