{
    let roleUpgrader = require('role.upgrader');
    let roleBuilder = require('role.builder');
    let tower_sp = require('tower');

    let roleHarvester = {

        /** @param {Creep} creep **/
        run: function (creep) {
            if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] < 50) {
                creep.memory.harvesting = true;
                creep.say('🔄 harvest');
            }
            if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
                creep.say('🚧 transfer');
            }

            let targets2 = creep.room.find(FIND_STRUCTURES, { //标明房间内有装能量的容器
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let targets = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的扩展和出生点
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            let closestTargets = creep.pos.findClosestByRange(targets);
            let targets1 = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的容器
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            let sources = creep.room.find(FIND_SOURCES, { //标明房间内的资源
                filter: (Source) => {
                    return Source.energy > 0;
                }
            });
            let targets3 = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的塔
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > creep.room.controller.level * 70);
                }
            });

            let storage_e = (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0) ? creep.room.storage : null; //有能量的storage (energy)
            let storage_ne = (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] == 0) ? creep.room.storage : null; //没能量的storage (no energy)
            let storage_nfe = (creep.room.storage && creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ? creep.room.storage : null; //有空余容量的storage (not full energy)

            if ((!targets.length && !targets1.length && !targets3.length && !storage_nfe)) {
                /*
                让闲置的收集者去升级。放在这里是为了跳过creep.memory.harvesting的检测。
                增加资源量的判断是为了避免原地tp。如果资源采集完了又没有判断，harvester就会反复拿起放下容器的能量。
                为了避免harvester不去补充未装满的扩展和出生点，又添加了资源检测，要是采集满了就会去补充。
                */
                roleBuilder.run(creep);
                return
            }

            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (target) {
                creep.pickup(target);
            }
            if (creep.memory.harvesting) { //采集能量资源
                let do_withdraw = -1;
                if (targets.length > 0 &&
                    (targets2.length > 0 || storage_e)) {
                    //在需要给出生点补充能量资源时，优先使用大容器的能量资源，之后再使用容器的能量资源
                    do_withdraw = 1;
                } else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) { //其次再采集能量资源
                    do_withdraw = 0;
                } else {
                    do_withdraw = 2;
                }

                if (do_withdraw == 1 && (storage_ne || !creep.room.storage)) { //如果大容器能量不足，优先将容器的能量转入出生点
                    if (creep.withdraw(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets2[0], {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                } else if (do_withdraw == 1 && storage_e) { //优先使用大容器的能量
                    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                } else if (do_withdraw == 0) { //容器没有能量则采集能量资源
                    creep.moveTo(sources[0], {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            } else { //运输资源
                //逻辑判断
                if (targets.length > 0) {
                    if (creep.transfer(closestTargets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTargets, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                } else if (targets3.length > 0) {
                    tower_sp.getEnergy(creep);
                } else if (targets1.length > 0) {
                    if (creep.transfer(targets1[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets1[0], {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                } else if (storage_nfe) {
                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
            }
        }
    };

    module.exports = roleHarvester;
}