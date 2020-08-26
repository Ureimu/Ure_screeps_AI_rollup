import { getBpNum } from "utils/bodypartsGenerator";

export function run(creep: Creep) {
    let workFunctionList: any = {
        harvestSource: harvestSource,
        carrySource: carrySource,
        upgradeController: upgradeController,
        buildAndRepair: buildAndRepair,
    };

    for (let taskType in workFunctionList) {
        compareTaskType(creep, workFunctionList[taskType], taskType);
    }
}

function compareTaskType(creep: Creep, workFunction: (creep: Creep) => void, taskType: string) {
    if (creep.memory.task.taskInf.taskType == taskType) {
        workFunction(creep);
    }
}

function harvestSource(creep: Creep): void {
    if(!creep.memory.dontPullMe)creep.memory.dontPullMe = true;
    let source = <Source>Game.getObjectById(<Id<Source>>creep.memory.task.sponsor);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: "#ffaa00"
            }
        });
    }
}

function carrySource(creep: Creep): void {
    if (!creep.memory.task.taskInf.harvesting && creep.store[RESOURCE_ENERGY] < 50) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say("🔄 harvest");
    }
    if (creep.memory.task.taskInf.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say("🚧 transfer");
    }

    if (creep.memory.task.taskInf.harvesting) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType == RESOURCE_ENERGY &&
                    resource.amount > 50 * getBpNum(creep.memory.bodyparts, "carry")
                );
            }
        });
        if (target) {
            creep.moveTo(<RoomPosition>creep.pos.findClosestByRange(<RoomPosition[]>target.pos.getSquare()), {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            creep.pickup(target);
        }
    } else {
        let targets = creep.room.find(FIND_STRUCTURES, {
            //标明房间内未装满的扩展和出生点
            filter: structure => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            }
        });
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}

function upgradeController(creep: Creep): void {
    if (!creep.memory.task.taskInf.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say("🔄 harvest");
    }
    if (creep.memory.task.taskInf.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say("🚧 upgrade");
    }

    if(<string>creep.room.controller?.sign?.username!='Ureium'){
        if(creep.signController(<StructureController>creep.room.controller,'testing')){
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
    if (creep.memory.task.taskInf.harvesting) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType == RESOURCE_ENERGY &&
                    resource.amount > 50 * getBpNum(creep.memory.bodyparts, "carry")
                );
            }
        });
        if (target) {
            creep.moveTo(target, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            creep.pickup(target);
        }
    } else {
        if (creep.upgradeController(<StructureController>creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}

function buildAndRepair(creep: Creep):void {
    if (!creep.memory.task.taskInf.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say("🔄 harvest");
    }
    if (creep.memory.task.taskInf.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say("🚧 b&r");
    }

    if (creep.memory.task.taskInf.harvesting) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType == RESOURCE_ENERGY &&
                    resource.amount > 50 * getBpNum(creep.memory.bodyparts, "carry")
                );
            }
        });
        if (target) {
            creep.moveTo(<RoomPosition>creep.pos.findClosestByRange(<RoomPosition[]>target.pos.getSquare()), {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            creep.pickup(target);
        }
    } else {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        }else{
            if (!creep.memory.task.taskInf.lastRenovate) {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax - 2200
                });
                targets.sort((a, b) => a.hits - b.hits);
                if (targets.length > 0) {
                    creep.memory.task.taskInf.lastRenovate = targets[0].id;
                    creep.memory.task.taskInf.lastRenovateHit = targets[0].hits;
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
            } else if (creep.memory.task.taskInf.lastRenovate) {
                let target_x = <AnyStructure>Game.getObjectById(creep.memory.task.taskInf.lastRenovate);
                if (creep.repair(target_x) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_x, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                if ((target_x.hits >= creep.memory.task.taskInf.lastRenovateHit + 120000) || (target_x.hits == target_x.hitsMax)) {
                    creep.memory.task.taskInf.lastRenovate = null;
                }
            } else {
                creep.say('error');
            }
        }
    }
}
