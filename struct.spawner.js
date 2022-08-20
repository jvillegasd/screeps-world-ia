class Spawner {
  constructor() {
    this.structureType = STRUCTURE_SPAWN;
    this.structureFilter = { structureType: this.structureType };
    this.sites = {};
    this.structures = {};
  }

  run(spawner) {}

  getStructures(room) {
    if (!this.structures[room.name]) {
      this.structures[room.name] = room.find(FIND_MY_SPAWNS, {
        filter: this.structureFilter,
      });
    }
    this.structures[room.name];
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
