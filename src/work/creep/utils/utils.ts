import { getBpNum } from "AllUtils/bodypartsGenerator";
import { lookForStructure } from "AllUtils/findEx";

/**
 * 一个多态状态机。
 *
 * @export
 * @param {Creep} creep
 * @param {Array<()=>number>} condiction
 * @param {number} stateIndex
 * @param {string[]} [say=["🔄 harvest", "🚧 working"]]
 * @returns {number}
 */
export function stateCut(
    creep: Creep,
    condiction: Array<() => number>,
    stateIndex: number,
    say: string[] = ["🔄 harvest", "🚧 working"]
): number {
    if (typeof creep.memory.task.taskInf.state[stateIndex] === "undefined") {
        let numList = [];
        for (let i = 0, j = stateIndex + 1; i < j; i++) {
            numList.push(0);
        }
        creep.memory.task.taskInf.state.push(...numList);
    }
    let stateNum = condiction[creep.memory.task.taskInf.state[stateIndex]]();
    if (creep.memory.task.taskInf.state[stateIndex] != stateNum) {
        creep.memory.task.taskInf.state[stateIndex] = stateNum;
        creep.say(say[stateNum]);
    }
    return creep.memory.task.taskInf.state[stateIndex];
}

export function transportResource(creep: Creep, target: AnyStructure, resourceType: ResourceConstant) {
    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
    }
}

export function test(creep: Creep, target: AnyStructure) {
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
        if (target_x.hits >= creep.memory.task.taskInf.lastObjHit + 120000 || target_x.hits == target_x.hitsMax) {
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
/**
 * 取得能量。
 *
 * @export
 * @param {Creep} creep
 * @param {string[]} structureList 按照优先级排序。
 * @param {number} [lowerLimit=500] container的最低能量限制。
 */
export function getEnergy(creep: Creep, structureList: string[], lowerLimit: number = 500) {
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: resource => {
            return (
                resource.resourceType == RESOURCE_ENERGY &&
                resource.amount > 50 * getBpNum(creep.memory.bodyparts, "carry")
            );
        }
    });
    const target2 = creep.pos.findClosestByRange(FIND_RUINS, {
        filter: resource => {
            return (
                resource.store["energy"] > 50 * getBpNum(creep.memory.bodyparts, "carry")
            );
        }
    });
    let containerStructures = [];
    for (let structureName of structureList) {
        let m = <AnyStoreStructure[]>lookForStructure(creep.room, structureName);
        let x = typeof m !== "undefined" ? m : [];
        containerStructures.push(...x);
    }
    const containersEnergy = _.filter(
        containerStructures,
        (i: { store: { [x: string]: number } }) =>
            i.store[RESOURCE_ENERGY] > 50 * getBpNum(creep.memory.bodyparts, "carry") + lowerLimit
    );
    if (containersEnergy[0]) {
        if (creep.withdraw(containersEnergy[0], "energy") == ERR_NOT_IN_RANGE) {
            creep.moveTo(containersEnergy[0], {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    } else if (target2) {
        creep.moveTo(target2, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
        creep.withdraw(target2,"energy");
    } else if (target) {
        creep.moveTo(target, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
        creep.pickup(target);
    }
}

export function getResourceFromStructure(creep: Creep, structure: AnyStoreStructure, resourceType: ResourceConstant) {
    if (structure) {
        if (creep.withdraw(structure, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}
