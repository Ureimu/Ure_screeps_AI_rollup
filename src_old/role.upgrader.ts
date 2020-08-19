let roleUpgrader_m = {

    /** @param {Creep} creep **/
    run: function (creep: Creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.pickup(target);
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        } else {
            let sources = creep.room.find(FIND_SOURCES, { //标明房间内的资源
                filter: (Source) => {
                    return Source.energy > 0;
                }
            });
            let targets2 = <StructureContainer[]>creep.room.find(FIND_STRUCTURES, { //标明房间内有装能量的容器
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            if (sources[0]) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            } else if (targets2[0]) {
                if (creep.withdraw(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets2[0], {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
        }
    }
};

module.exports = roleUpgrader_m;