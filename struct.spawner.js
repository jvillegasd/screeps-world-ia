const ROLE_NAMES = ['role.harvester', 'role.builder', 'role.upgrader'];

const roles = ROLE_NAMES.map((role) => require(role));

class Spawner {
  constructor() {
    this.structureType = STRUCTURE_SPAWN;
    this.structureFilter = { structureType: this.structureType };
    this.sites = {};
    this.structures = {};
  }

  run(spawner) {
    for (const role of roles) {
      if (role.canSpawn(spawner)) {
        role.spawn(spawner);
      }
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
