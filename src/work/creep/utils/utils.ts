import { getBpNum } from "utils/bodypartsGenerator";
import { getStructureFromArray, lookForStructure, lookForStructureName } from "utils/findEx";

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
    say: string[] = ["🚧 working", "🔄 harvest"]
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
    if(creep.memory.task.taskInf.lastSource == lookForStructureName(target)) return;
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
export function getEnergy(creep: Creep, lowerLimit: Array<{[name:string]: number}> = [{}]): string {

    let structureList: Array<{ [name: string]: AnyStoreStructure[]; }> = getStructureFromArray(creep.room, lowerLimit);
    let containersL = [];
    for(let i = 0, j=structureList.length;i<j;i++){
        let st1 = structureList[i];
        for(let st2 in st1){
            const containers = _.filter(
                st1[st2],
                (j: { store: { [x: string]: number } }) =>
                    j.store[RESOURCE_ENERGY] > 50 * getBpNum(creep.memory.bodyparts, "carry") + lowerLimit[i][st2]
            );
            if(containers.length>0){
                containersL.push(...containers);
                //console.log(""+lowerLimit[i][st2]);
            }
        }
        if(containersL.length!=0){
            break;
        }
    }
    let containersEnergy = creep.pos.findClosestByRange(containersL);
    let containersName = lookForStructureName(containersEnergy);


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

    if (containersEnergy) {
        if (creep.withdraw(containersEnergy, "energy") == ERR_NOT_IN_RANGE) {
            creep.moveTo(containersEnergy, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
        creep.memory.task.taskInf.lastSource = containersName;
        return containersName;
    } else if (target2) {
        creep.moveTo(target2, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
        creep.withdraw(target2,"energy");
        creep.memory.task.taskInf.lastSource = "ruins";
        return "ruins";
    } else if (target) {
        creep.moveTo(target, {
            visualizePathStyle: {
                stroke: "#ffffff"
            }
        });
        creep.pickup(target);
        creep.memory.task.taskInf.lastSource = "droppedEnergy"
        return "droppedEnergy";
    } else {
        return "null";
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
