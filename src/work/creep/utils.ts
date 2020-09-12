import { getBpNum } from "utils/bodypartsGenerator";

export function stateCut(creep: Creep, on: boolean, off: boolean, say: string = "🚧 working"): boolean {
    if (!creep.memory.task.taskInf.harvesting && on) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say("🔄 harvest");
    }
    if (creep.memory.task.taskInf.harvesting && off) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say(say);
    }
    return creep.memory.task.taskInf.harvesting;
}

export function test(creep: Creep){
    if (!creep.memory.task.taskInf.lastObj) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax - 2200
        });
        targets.sort((a, b) => a.hits - b.hits);
        if (targets.length > 0) {
            creep.memory.task.taskInf.lastObj = targets[0].id;
            creep.memory.task.taskInf.lastObjHit = targets[0].hits;
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                });
            }
        }
    } else if (creep.memory.task.taskInf.lastObj) {
        let target_x = <AnyStructure>Game.getObjectById(creep.memory.task.taskInf.lastObj);
        if (
            target_x.hits >= creep.memory.task.taskInf.lastObjHit + 120000 ||
            target_x.hits == target_x.hitsMax
        ) {
            creep.memory.task.taskInf.lastObj = null;
        } else if (creep.repair(target_x) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target_x, {
                visualizePathStyle: {
                    stroke: "#ffaa00"
                }
            });
        }
    } else {
        creep.say("error");
    }
}

export function getEnergy(creep: Creep) {
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: resource => {
            return (
                resource.resourceType == RESOURCE_ENERGY &&
                resource.amount > 50 * getBpNum(creep.memory.bodyparts, "carry")
            );
        }
    });
    const containersEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        //标明房间内有装能量的容器
        filter: i => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
    });

    if (target) {
        creep.moveTo(target, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
        creep.pickup(target);
    } else if (containersEnergy) {
        if (creep.withdraw(containersEnergy, "energy") == ERR_NOT_IN_RANGE) {
            creep.moveTo(containersEnergy, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}
