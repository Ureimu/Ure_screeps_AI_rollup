{
	let roleUpgrader = require('role.upgrader');

	let roleBuilder = {

		/** @param {Creep} creep **/
		run: function (creep) {

			if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.building = false;
				creep.say('🔄 harvest');
			}
			if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}

			const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			if (target) {
				creep.pickup(target);
			}
			if (creep.memory.building) {
				let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length) {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {
							visualizePathStyle: {
								stroke: '#ffffff'
							}
						});
					}

				} else { //让闲置的建造者去升级。
					roleUpgrader.run(creep);
				}
			} else {
				let sources = creep.room.find(FIND_SOURCES);
				let container_e = creep.room.find(FIND_STRUCTURES, { //标明房间内有装能量的容器
					filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
						i.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
				});
				/*
				if(container_e.length>0 && sources[0].energy == 0) {
					let closest =creep.pos.findClosestByRange(container_e);
					if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				}
				*/
				let targets = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的扩展和出生点
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				let targets1 = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的容器
					filter: (structure) => {
						return structure.structureType == STRUCTURE_CONTAINER &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				if (sources[1].energy > 0 && (targets.length || targets1.length)) { //如果第二个资源点没用完而且还有未装满的扩展和出生点/未装满的容器的话，就把第一个资源点让给harvester用了。
					if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[1], {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
				} else if (sources[0].energy > 0) { //先用第一个资源点的资源
					if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[0], {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
				} else { //用完了就用容器的资源
					let closest = creep.pos.findClosestByRange(container_e);
					if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(closest, {
							visualizePathStyle: {
								stroke: '#ffaa00'
							}
						});
					}
				}
			}
		}
	};

	module.exports = roleBuilder;
}