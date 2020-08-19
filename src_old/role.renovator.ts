{
	let roleRenovator = {

		/** @param {Creep} creep **/
		run: function (creep) {

			if (creep.memory.renovating && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.renovating = false;
				creep.say('🔄 harvest');
			}
			if (!creep.memory.renovating && creep.store.getFreeCapacity() == 0) {
				creep.memory.renovating = true;
				creep.say('🚧 renovate');
			}

			const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			if (target) {
				creep.pickup(target);
			}
			if (creep.memory.renovating) {
				if (!creep.memory.lastRenovate) {
					let targets = creep.room.find(FIND_STRUCTURES, {
						filter: object => object.hits < object.hitsMax - 2200
					});
					targets.sort((a, b) => a.hits - b.hits);
					if (targets.length > 0) {
						creep.memory.lastRenovate = targets[0].id;
						creep.memory.lastRenovateHit = targets[0].hits;
						if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], {
								visualizePathStyle: {
									stroke: '#ffaa00'
								}
							});
						}
					} else {
						let roleBuilder = require('role.builder');
						roleBuilder.run(creep);
					}
				} else if (creep.memory.lastRenovate) {
					let target_x = <AnyStructure>Game.getObjectById(creep.memory.lastRenovate);
					if (creep.repair(target_x) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target_x, {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
					if ((target_x.hits >= creep.memory.lastRenovateHit + 120000) || (target_x.hits == target_x.hitsMax)) {
						creep.memory.lastRenovate = null;
					}
				} else {
					creep.say('error');
				}
			} else {
				let sources = creep.room.find(FIND_SOURCES);

				if (sources[1] && sources[1].energy > 0) {
					if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[1], {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
				} else {
					if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[0], {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
				}
			}
		}
	};

	module.exports = roleRenovator;
}